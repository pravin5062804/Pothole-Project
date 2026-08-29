import * as turf from '@turf/turf';
import { Issue } from '../models/Issue.js';
import { ENV } from '../config/env.js';

/**
 * Finds if there is an existing open issue near the given coordinates of the same category
 * @param {Array<number>} coordinates - [longitude, latitude]
 * @param {string} category - Issue category
 * @param {number} [maxRadiusMeters] - Max search radius in meters
 * @returns {Promise<{isDuplicate: boolean, matchedIssue: Issue|null, distanceMeters: number|null}>}
 */
export const findDuplicateIssue = async (
  coordinates,
  category,
  maxRadiusMeters = ENV.DEDUP_RADIUS_METERS
) => {
  if (!coordinates || coordinates.length !== 2) {
    return { isDuplicate: false, matchedIssue: null, distanceMeters: null };
  }

  const [lng, lat] = coordinates;

  try {
    // Query existing open or active issues within max radius using 2dsphere index
    const nearbyIssues = await Issue.find({
      status: { $in: ['reported', 'verified', 'assigned', 'in_progress', 'reopened'] },
      category: category,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxRadiusMeters,
        },
      },
    }).limit(5);

    if (!nearbyIssues || nearbyIssues.length === 0) {
      return { isDuplicate: false, matchedIssue: null, distanceMeters: null };
    }

    // Use Turf.js to compute precise distance in meters to the nearest matching issue
    const newPoint = turf.point([lng, lat]);
    let closestIssue = null;
    let minDistance = Infinity;

    for (const issue of nearbyIssues) {
      const existingCoords = issue.location.coordinates;
      const existingPoint = turf.point(existingCoords);
      const distance = turf.distance(newPoint, existingPoint, { units: 'meters' });

      if (distance < minDistance && distance <= maxRadiusMeters) {
        minDistance = distance;
        closestIssue = issue;
      }
    }

    if (closestIssue) {
      return {
        isDuplicate: true,
        matchedIssue: closestIssue,
        distanceMeters: Math.round(minDistance),
      };
    }

    return { isDuplicate: false, matchedIssue: null, distanceMeters: null };
  } catch (error) {
    console.error(`[GeoCluster Service Error] ${error.message}`);
    return { isDuplicate: false, matchedIssue: null, distanceMeters: null };
  }
};

/**
 * Merges a newly reported duplicate into an existing parent issue
 * @param {Issue} parentIssue
 * @param {Object} reportData
 * @param {Object} [user]
 * @returns {Promise<Issue>}
 */
export const mergeDuplicateReport = async (parentIssue, reportData, user = null) => {
  parentIssue.recurrenceCount += 1;

  // Append reporter details
  parentIssue.reporters.push({
    user: user ? user._id : null,
    name: reportData.reporterName || user?.name || 'Anonymous Citizen',
    email: reportData.reporterEmail || user?.email || '',
    phone: reportData.reporterPhone || user?.phone || '',
    reportedAt: new Date(),
  });

  // If new photo is provided, add to issue photos if under limit
  if (reportData.photoUrl) {
    parentIssue.photos.push({
      url: reportData.photoUrl,
      public_id: reportData.photoPublicId || '',
    });
  }

  // Recalculate priority score: baseWeight * recurrenceCount * multiplier
  const weights = { low: 1, medium: 2, high: 3, critical: 4 };
  const baseWeight = weights[parentIssue.severity] || 2;
  parentIssue.priorityScore = Number((baseWeight * parentIssue.recurrenceCount * 10).toFixed(1));

  // Add timeline note
  parentIssue.timeline.push({
    status: parentIssue.status,
    updatedByName: 'Deduplication Engine',
    note: `Duplicate report merged automatically (Recurrence #${parentIssue.recurrenceCount}). Priority score updated to ${parentIssue.priorityScore}.`,
    timestamp: new Date(),
  });

  await parentIssue.save();
  return parentIssue;
};
