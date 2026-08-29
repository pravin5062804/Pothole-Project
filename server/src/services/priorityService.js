/**
 * Priority Scoring Service for Civic Issues
 * 
 * Formula: PriorityScore = (SeverityWeight * CategoryWeight * RecurrenceMultiplier) + AgeBonus
 */

const SEVERITY_WEIGHTS = {
  low: 1.0,
  medium: 2.0,
  high: 3.5,
  critical: 5.0,
};

const CATEGORY_WEIGHTS = {
  drainage: 1.3, // High health & flood risk
  pothole: 1.25, // High road accident risk
  water: 1.2,    // Essential utility
  garbage: 1.1,  // Sanitation
  streetlight: 1.0, // Safety
  other: 0.9,
};

/**
 * Computes an explainable priority score for an issue
 * @param {Object} issue
 * @returns {number}
 */
export const calculatePriorityScore = (issue) => {
  const severityWeight = SEVERITY_WEIGHTS[issue.severity] || 2.0;
  const categoryWeight = CATEGORY_WEIGHTS[issue.category] || 1.0;
  const recurrenceCount = issue.recurrenceCount || 1;

  // Recurrence multiplier grows with log curve to reward multiple citizen voices
  const recurrenceMultiplier = 1 + Math.log2(recurrenceCount);

  // Age factor: if reported > 3 days ago and still pending, add urgency bonus
  let ageBonus = 0;
  if (issue.createdAt) {
    const daysOpen = (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    ageBonus = Math.min(daysOpen * 0.5, 5); // max 5 bonus points for aging
  }

  // Disputed flag adds high priority
  const disputeBonus = issue.disputedResolution ? 10 : 0;

  const rawScore = (severityWeight * 10 * categoryWeight * recurrenceMultiplier) + ageBonus + disputeBonus;
  return Number(rawScore.toFixed(1));
};
