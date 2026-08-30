import express from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  assignWorker,
  autoDispatchSingle,
  batchAutoDispatch,
  getDashboardStats,
} from '../controllers/issueController.js';
import { protect, optionalAuth, authorizeRoles } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { reportLimiter } from '../middlewares/rateLimit.js';
import { validateCreateIssue, validateUpdateStatus } from '../middlewares/validate.js';

const router = express.Router();

// Public / General routes
router.get('/stats/overview', getDashboardStats);
router.get('/', getIssues);
router.get('/:id', getIssueById);

// Submit new report (with Multer photo upload & rate limiter)
router.post(
  '/',
  reportLimiter,
  optionalAuth,
  upload.array('photos', 5),
  validateCreateIssue,
  createIssue
);

// Admin & Worker routes
router.patch('/:id/status', protect, authorizeRoles('admin', 'worker'), validateUpdateStatus, updateIssueStatus);
router.patch('/:id/assign', protect, authorizeRoles('admin'), assignWorker);

// Smart Queue Auto-Dispatch routes (Admin)
router.post('/:id/auto-dispatch', protect, authorizeRoles('admin'), autoDispatchSingle);
router.post('/queue/batch-dispatch', protect, authorizeRoles('admin'), batchAutoDispatch);

export default router;
