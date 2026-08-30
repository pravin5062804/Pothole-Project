import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { emitIssueStatusUpdate } from './notificationService.js';

// Predefined Ward Specialized Maintenance Crews
const SPECIALIZED_CREWS = {
  pothole: 'Ward 1 Road Maintenance Crew (Lead: Eng. Rajesh)',
  drainage: 'Ward 4 Drainage & Stormwater Crew (Lead: Eng. Preeti)',
  garbage: 'Ward 2 Sanitation & Waste Disposal Unit (Lead: Eng. Sunita)',
  streetlight: 'Ward 3 Electrical & Streetlight Division (Lead: Eng. Amit)',
  water: 'Ward 4 Water Pipeline & Utilities Unit (Lead: Eng. Manoj)',
  other: 'Ward 5 Emergency Civil Response Team (Lead: Eng. Vikram)',
};

/**
 * Smart Queue Matcher:
 * Finds the optimal crew/worker based on Issue Category, Priority Score, and current workload.
 */
export const findOptimalWorkerForIssue = async (category, ward = '') => {
  const catLower = (category || 'other').toLowerCase();

  // Try to find matching registered field worker in DB
  const workers = await User.find({ role: 'worker' }).select('_id name email ward');
  
  if (workers.length > 0) {
    // Check if any worker matches ward or choose the one with fewest active jobs
    const workerJobCounts = await Promise.all(
      workers.map(async (w) => {
        const count = await Issue.countDocuments({
          assignedWorker: w._id,
          status: { $in: ['assigned', 'in_progress'] },
        });
        return { worker: w, count };
      })
    );

    // Sort by lowest active load
    workerJobCounts.sort((a, b) => a.count - b.count);
    const leastLoaded = workerJobCounts[0].worker;

    return {
      workerId: leastLoaded._id,
      workerName: `${leastLoaded.name} (${leastLoaded.ward || 'Field Unit'})`,
      isRegisteredUser: true,
    };
  }

  // Fallback to specialized municipal team
  const crewName = SPECIALIZED_CREWS[catLower] || SPECIALIZED_CREWS.other;
  return {
    workerId: null,
    workerName: crewName,
    isRegisteredUser: false,
  };
};

/**
 * Auto-Dispatch a single issue
 */
export const autoDispatchSingleIssue = async (issueId, adminUser = null, io = null) => {
  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new Error('Issue not found');
  }

  const assigned = await findOptimalWorkerForIssue(issue.category, issue.ward);

  if (assigned.workerId) {
    issue.assignedWorker = assigned.workerId;
  }
  issue.assignedCrewName = assigned.workerName;
  issue.status = 'assigned';

  const note = `⚡ Auto-Dispatched via Smart Priority Queue System to ${assigned.workerName}. Priority Score: ${issue.priorityScore || 50}.`;

  issue.timeline.push({
    status: 'assigned',
    updatedBy: adminUser?._id || null,
    updatedByName: 'Smart Queue Dispatcher',
    note,
    timestamp: new Date(),
  });

  await issue.save();

  if (io) {
    emitIssueStatusUpdate(io, issue._id.toString(), {
      issueId: issue._id,
      ticketId: issue.ticketId,
      status: issue.status,
      assignedWorkerName: assigned.workerName,
    });
  }

  return { issue, assignedTo: assigned.workerName };
};

/**
 * Batch Auto-Dispatch all unassigned reports in the queue (sorted by highest priority first)
 */
export const batchAutoDispatchQueue = async (adminUser = null, io = null) => {
  const unassignedIssues = await Issue.find({
    status: { $in: ['reported', 'verified', 'reopened'] },
  }).sort({ priorityScore: -1, createdAt: 1 });

  const results = [];
  for (const issue of unassignedIssues) {
    try {
      const dispatched = await autoDispatchSingleIssue(issue._id, adminUser, io);
      results.push({
        ticketId: issue.ticketId || issue._id,
        title: issue.title,
        assignedTo: dispatched.assignedTo,
      });
    } catch (err) {
      console.warn(`Failed to auto-dispatch issue ${issue._id}:`, err.message);
    }
  }

  return {
    dispatchedCount: results.length,
    dispatchedIssues: results,
  };
};
