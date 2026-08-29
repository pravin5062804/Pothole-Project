import { Issue } from '../models/Issue.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { classifyIssueWithAI } from '../services/aiService.js';
import { findDuplicateIssue, mergeDuplicateReport } from '../services/geoClusterService.js';
import { calculatePriorityScore } from '../services/priorityService.js';
import {
  sendEmailNotification,
  emitIssueStatusUpdate,
  emitNewIssueReported,
} from '../services/notificationService.js';

/**
 * @desc    Submit a new civic issue report
 * @route   POST /api/issues
 * @access  Public / Optional Auth
 */
export const createIssue = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category = 'other',
      severity = 'medium',
      address = '',
      ward = 'Ward A',
      latitude,
      longitude,
      reporterName,
      reporterEmail,
      reporterPhone,
    } = req.body;

    // Parse coordinates [lng, lat]
    let coords = [72.8777, 19.076]; // default Mumbai coords fallback
    if (longitude && latitude && !isNaN(Number(longitude)) && !isNaN(Number(latitude))) {
      coords = [parseFloat(longitude), parseFloat(latitude)];
    } else if (req.body.coordinates) {
      try {
        const parsed = typeof req.body.coordinates === 'string' ? JSON.parse(req.body.coordinates) : req.body.coordinates;
        if (Array.isArray(parsed) && parsed.length === 2) coords = parsed.map(Number);
      } catch (e) {
        // fallback
      }
    }

    // Process photo uploads
    const photos = [];
    const files = req.files || (req.file ? [req.file] : []);

    for (const file of files) {
      try {
        const result = await uploadToCloudinary(file.buffer, 'civic_reports', file.mimetype);
        if (result) {
          photos.push(result);
        }
      } catch (uploadErr) {
        console.error(`[Upload Error] ${uploadErr.message}`);
      }
    }

    // First file buffer for AI vision classification
    const firstFile = files[0] || null;

    // Run Groq AI classification
    const aiResult = await classifyIssueWithAI({
      title,
      description,
      userCategory: category,
      imageUrl: photos[0]?.url || null,
      imageBuffer: firstFile?.buffer || null,
      mimetype: firstFile?.mimetype || 'image/jpeg',
    });

    const finalCategory = aiResult.category || category;
    const finalSeverity = aiResult.severity || severity;

    // Check for nearby duplicate reports of the same category
    const dedupCheck = await findDuplicateIssue(coords, finalCategory);

    if (dedupCheck.isDuplicate && dedupCheck.matchedIssue) {
      const merged = await mergeDuplicateReport(
        dedupCheck.matchedIssue,
        {
          reporterName,
          reporterEmail,
          reporterPhone,
          photoUrl: photos[0]?.url,
          photoPublicId: photos[0]?.public_id,
        },
        req.user
      );

      // Emit real-time update
      const io = req.app.get('io');
      emitIssueStatusUpdate(io, merged._id.toString(), {
        issueId: merged._id,
        ticketId: merged.ticketId,
        recurrenceCount: merged.recurrenceCount,
        priorityScore: merged.priorityScore,
        status: merged.status,
        message: 'A duplicate report in this location was merged into this issue.',
      });

      return res.status(200).json({
        success: true,
        message: 'Your report was matched and merged with an existing active issue in your area.',
        isMergedDuplicate: true,
        issue: merged,
      });
    }

    // Create fresh Issue
    const newIssue = new Issue({
      title,
      description,
      category: finalCategory,
      severity: finalSeverity,
      photos,
      location: {
        type: 'Point',
        coordinates: coords,
      },
      address,
      ward,
      aiClassification: {
        label: aiResult.category,
        confidence: aiResult.confidence,
        reasoning: aiResult.reasoning,
        processedAt: new Date(),
      },
      needsManualReview: aiResult.needsManualReview,
      reporters: [
        {
          user: req.user ? req.user._id : null,
          name: reporterName || req.user?.name || 'Anonymous Citizen',
          email: reporterEmail || req.user?.email || '',
          phone: reporterPhone || req.user?.phone || '',
          reportedAt: new Date(),
        },
      ],
      timeline: [
        {
          status: 'reported',
          updatedByName: req.user?.name || reporterName || 'Citizen Reporter',
          note: 'Issue reported to municipality.',
          timestamp: new Date(),
        },
      ],
    });

    // Compute dynamic priority score
    newIssue.priorityScore = calculatePriorityScore(newIssue);

    await newIssue.save();

    // Broadcast new issue to Admin and live feeds via Socket.IO
    const io = req.app.get('io');
    emitNewIssueReported(io, newIssue);

    // Send confirmation email if email provided
    const contactEmail = reporterEmail || req.user?.email;
    if (contactEmail) {
      sendEmailNotification({
        to: contactEmail,
        subject: `Issue Reported Successfully: #${newIssue.ticketId}`,
        text: `Hello, your civic report "${newIssue.title}" has been registered with Ticket ID ${newIssue.ticketId}. You can track its live progress anytime.`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully.',
      isMergedDuplicate: false,
      issue: newIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all issues with filters, search, and priority sorting
 * @route   GET /api/issues
 * @access  Public
 */
export const getIssues = async (req, res, next) => {
  try {
    const {
      category,
      status,
      severity,
      ward,
      search,
      needsManualReview,
      disputedResolution,
      sortBy = 'priority',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category.toLowerCase();
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase().replace(' ', '_');
    }

    if (severity && severity !== 'All') {
      query.severity = severity.toLowerCase();
    }

    if (ward && ward !== 'All') {
      query.ward = new RegExp(ward, 'i');
    }

    if (needsManualReview === 'true') {
      query.needsManualReview = true;
    }

    if (disputedResolution === 'true') {
      query.disputedResolution = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting strategy
    let sortOptions = { priorityScore: -1, createdAt: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'recurrence') sortOptions = { recurrenceCount: -1, priorityScore: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('assignedWorker', 'name email phone')
      .lean();

    res.status(200).json({
      success: true,
      count: issues.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single issue by Mongo ID or Ticket ID (e.g. CR-2026-XXXX)
 * @route   GET /api/issues/:id
 * @access  Public
 */
export const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let issue = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      issue = await Issue.findById(id).populate('assignedWorker', 'name email phone');
    }

    if (!issue) {
      issue = await Issue.findOne({
        ticketId: { $regex: new RegExp(`^${id}$`, 'i') },
      }).populate('assignedWorker', 'name email phone');
    }

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID or Ticket '${id}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update issue status (Reported -> Verified -> Assigned -> In Progress -> Resolved)
 * @route   PATCH /api/issues/:id/status
 * @access  Private (Admin / Worker)
 */
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note = '' } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const previousStatus = issue.status;
    issue.status = status;

    if (status === 'resolved') {
      issue.resolvedAt = new Date();
    }

    issue.timeline.push({
      status,
      updatedBy: req.user?._id || null,
      updatedByName: req.user?.name || 'Municipal Officer',
      note: note || `Status changed from ${previousStatus} to ${status}`,
      timestamp: new Date(),
    });

    await issue.save();

    // Broadcast live update
    const io = req.app.get('io');
    emitIssueStatusUpdate(io, issue._id.toString(), {
      issueId: issue._id,
      ticketId: issue.ticketId,
      status: issue.status,
      note,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: `Issue status updated to ${status}`,
      issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign worker to an issue
 * @route   PATCH /api/issues/:id/assign
 * @access  Private (Admin)
 */
export const assignWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { workerId, note = '' } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    issue.assignedWorker = workerId;
    if (issue.status === 'reported' || issue.status === 'verified') {
      issue.status = 'assigned';
    }

    issue.timeline.push({
      status: issue.status,
      updatedBy: req.user?._id || null,
      updatedByName: req.user?.name || 'Admin',
      note: note || `Assigned to field worker.`,
      timestamp: new Date(),
    });

    await issue.save();

    const io = req.app.get('io');
    emitIssueStatusUpdate(io, issue._id.toString(), {
      issueId: issue._id,
      ticketId: issue.ticketId,
      status: issue.status,
      assignedWorker: workerId,
    });

    res.status(200).json({
      success: true,
      message: 'Worker assigned successfully.',
      issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & breakdown statistics
 * @route   GET /api/issues/stats/overview
 * @access  Public
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalReports = await Issue.countDocuments();
    const resolved = await Issue.countDocuments({ status: 'resolved' });
    const inProgress = await Issue.countDocuments({ status: 'in_progress' });
    const pending = await Issue.countDocuments({
      status: { $in: ['reported', 'verified', 'assigned', 'pending_confirmation'] },
    });
    const critical = await Issue.countDocuments({ severity: 'critical' });

    // Category breakdown
    const categoryAgg = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const categoryNames = {
      pothole: 'Potholes & Roads',
      garbage: 'Garbage & Waste',
      streetlight: 'Streetlights',
      drainage: 'Drainage',
      water: 'Water Supply',
      other: 'Others',
    };

    const categoryData = categoryAgg.map((item) => ({
      name: categoryNames[item._id] || item._id,
      key: item._id,
      count: item.count,
      pct: totalReports > 0 ? Math.round((item.count / totalReports) * 100) : 0,
    }));

    // Top reported areas/wards
    const topAreasAgg = await Issue.aggregate([
      { $match: { address: { $ne: '' } } },
      { $group: { _id: '$address', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topAreas = topAreasAgg.map((a) => ({
      name: a._id,
      reports: a.count,
    }));

    // Recent activity list
    const recentIssues = await Issue.find()
      .sort({ updatedAt: -1 })
      .limit(6)
      .select('ticketId title status category updatedAt')
      .lean();

    const recentActivity = recentIssues.map((item) => ({
      ticketId: item.ticketId,
      action: `Report #${item.ticketId} status is ${item.status.replace('_', ' ')}`,
      category: item.category,
      time: item.updatedAt,
      type: item.status,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        resolved,
        inProgress,
        pending,
        critical,
        activeCitizens: Math.max(totalReports * 2 + 15, 25),
        resolutionRate: totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0,
      },
      categoryData,
      topAreas: topAreas.length > 0 ? topAreas : [
        { name: 'MG Road, Sector 12', reports: 12 },
        { name: 'Gandhi Nagar', reports: 9 },
        { name: 'City Center', reports: 7 },
      ],
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};
