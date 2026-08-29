import express from 'express';
import {
  submitResolutionEvidence,
  submitConfirmationVote,
  getIssueVotes,
} from '../controllers/verificationController.js';
import { protect, optionalAuth, authorizeRoles } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validateConfirmationVote } from '../middlewares/validate.js';

const router = express.Router();

// Worker marks done + uploads resolution evidence photos
router.post(
  '/:id/submit-evidence',
  protect,
  authorizeRoles('worker', 'admin'),
  upload.array('evidencePhotos', 3),
  submitResolutionEvidence
);

// Citizen confirmation / dispute vote
router.post(
  '/:id/vote',
  optionalAuth,
  upload.single('photo'),
  validateConfirmationVote,
  submitConfirmationVote
);

// Get votes for an issue
router.get('/:id/votes', getIssueVotes);

export default router;
