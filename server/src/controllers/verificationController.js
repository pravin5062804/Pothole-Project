import { Issue } from '../models/Issue.js';
import { ConfirmationVote } from '../models/ConfirmationVote.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { emitIssueStatusUpdate } from '../services/notificationService.js';
import { calculatePriorityScore } from '../services/priorityService.js';

/**
 * @desc    Field worker marks issue as completed with resolution evidence photo
 * @route   POST /api/verification/:id/submit-evidence
 * @access  Private (Worker / Admin)
 */
export const submitResolutionEvidence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // Upload resolution evidence photos if present
    const evidencePhotos = [];
    const files = req.files || (req.file ? [req.file] : []);

    for (const file of files) {
      try {
        const result = await uploadToCloudinary(file.buffer, 'resolution_evidence', file.mimetype);
        if (result) evidencePhotos.push(result);
      } catch (err) {
        console.error(`[Resolution Evidence Upload Error] ${err.message}`);
      }
    }

    issue.status = 'pending_confirmation';
    issue.resolutionNotes = resolutionNotes || '';
    if (evidencePhotos.length > 0) {
      issue.resolutionEvidence.push(...evidencePhotos);
    }
    issue.resolutionSubmittedAt = new Date();
    // 3-day community verification window
    issue.confirmationWindowExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    issue.timeline.push({
      status: 'pending_confirmation',
      updatedBy: req.user?._id || null,
      updatedByName: req.user?.name || 'Field Worker',
      note: `Work completed by field crew. Pending citizen/community verification.`,
      timestamp: new Date(),
    });

    await issue.save();

    const io = req.app.get('io');
    emitIssueStatusUpdate(io, issue._id.toString(), {
      issueId: issue._id,
      ticketId: issue.ticketId,
      status: issue.status,
      resolutionEvidence: issue.resolutionEvidence,
      message: 'Resolution evidence submitted. Ready for community verification.',
    });

    res.status(200).json({
      success: true,
      message: 'Work marked as completed. Issue moved to Pending Confirmation.',
      issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Citizen submits confirmation vote (Confirm fix / Dispute fix)
 * @route   POST /api/verification/:id/vote
 * @access  Public / Optional Auth
 */
export const submitConfirmationVote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vote, comment = '', voterName } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (issue.status !== 'pending_confirmation' && issue.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: `Cannot vote on an issue with status '${issue.status}'. It must be in 'pending_confirmation'.`,
      });
    }

    // Process optional dispute/confirmation photo
    let photoObj = null;
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'vote_photos', req.file.mimetype);
      if (uploadRes) photoObj = uploadRes;
    }

    const newVote = await ConfirmationVote.create({
      issueId: issue._id,
      userId: req.user ? req.user._id : null,
      voterName: voterName || req.user?.name || 'Local Citizen',
      vote,
      comment,
      photo: photoObj,
    });

    // Check tally of confirmation vs disputes
    const confirms = await ConfirmationVote.countDocuments({ issueId: issue._id, vote: 'confirm' });
    const disputes = await ConfirmationVote.countDocuments({ issueId: issue._id, vote: 'dispute' });

    let statusChanged = false;

    if (vote === 'dispute') {
      // Immediate dispute or threshold moves issue to reopened
      issue.status = 'reopened';
      issue.disputedResolution = true;
      issue.priorityScore = calculatePriorityScore(issue); // Bump priority
      statusChanged = true;

      issue.timeline.push({
        status: 'reopened',
        updatedByName: voterName || req.user?.name || 'Citizen Community',
        note: `Citizen disputed the resolution: "${comment || 'Work unsatisfactory'}". Reopened with elevated priority.`,
        timestamp: new Date(),
      });
    } else if (confirms >= 1 && disputes === 0) {
      // First confirm rule moves to fully resolved
      issue.status = 'resolved';
      issue.resolvedAt = new Date();
      issue.disputedResolution = false;
      statusChanged = true;

      issue.timeline.push({
        status: 'resolved',
        updatedByName: voterName || req.user?.name || 'Citizen Community',
        note: `Resolution verified & confirmed by citizen community.`,
        timestamp: new Date(),
      });
    }

    if (statusChanged) {
      await issue.save();
    }

    const io = req.app.get('io');
    emitIssueStatusUpdate(io, issue._id.toString(), {
      issueId: issue._id,
      ticketId: issue.ticketId,
      status: issue.status,
      disputedResolution: issue.disputedResolution,
      confirmsCount: confirms,
      disputesCount: disputes,
    });

    res.status(201).json({
      success: true,
      message: `Vote '${vote}' recorded successfully.`,
      vote: newVote,
      issueStatus: issue.status,
      tallies: { confirms, disputes },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all verification votes for an issue
 * @route   GET /api/verification/:id/votes
 * @access  Public
 */
export const getIssueVotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const votes = await ConfirmationVote.find({ issueId: id }).sort({ createdAt: -1 });

    const confirms = votes.filter((v) => v.vote === 'confirm').length;
    const disputes = votes.filter((v) => v.vote === 'dispute').length;

    res.status(200).json({
      success: true,
      tallies: { confirms, disputes },
      votes,
    });
  } catch (error) {
    next(error);
  }
};
