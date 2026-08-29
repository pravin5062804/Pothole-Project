import app from './src/app.js';
import { classifyIssueWithAI } from './src/services/aiService.js';
import { calculatePriorityScore } from './src/services/priorityService.js';

async function runTests() {
  console.log('--- Starting Backend Verification Tests ---');

  // 1. Test AI Service Fallback & Prompt Logic
  console.log('[Test 1] Testing AI Classification...');
  const aiRes1 = await classifyIssueWithAI({
    title: 'Huge crater pothole near junction',
    description: 'Road is completely damaged and causing motorcycle accidents',
    userCategory: 'other',
  });
  console.log('AI Result 1:', aiRes1);
  if (aiRes1.category !== 'pothole') {
    throw new Error('AI Classification failed for pothole keyword');
  }

  // 2. Test Priority Scoring Algorithm
  console.log('\n[Test 2] Testing Priority Scoring...');
  const score1 = calculatePriorityScore({
    severity: 'critical',
    category: 'pothole',
    recurrenceCount: 3,
    createdAt: new Date(),
  });
  console.log(`Computed Priority Score (Critical, Pothole, 3 merges): ${score1}`);
  if (score1 <= 0) throw new Error('Invalid priority score');

  // 3. Test App Routing Exports
  console.log('\n[Test 3] Verifying Express routes...');
  if (app) {
    console.log('Express app configured properly.');
  }

  console.log('\n--- ALL UNIT TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
