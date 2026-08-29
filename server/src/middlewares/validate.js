import { validationResult, body, param, query } from 'express-validator';

/**
 * Middleware to check validation errors and return 400 with formatted errors
 */
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['citizen', 'admin', 'worker']).withMessage('Invalid role'),
  checkValidation,
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  checkValidation,
];

/**
 * Validation rules for issue submission
 */
export const validateCreateIssue = [
  body('title').trim().notEmpty().withMessage('Issue title is required').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .optional()
    .isIn(['pothole', 'garbage', 'drainage', 'streetlight', 'water', 'other'])
    .withMessage('Invalid category'),
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  checkValidation,
];

/**
 * Validation rules for status update
 */
export const validateUpdateStatus = [
  param('id').isMongoId().withMessage('Invalid issue ID'),
  body('status')
    .isIn([
      'reported',
      'verified',
      'assigned',
      'in_progress',
      'pending_confirmation',
      'resolved',
      'reopened',
    ])
    .withMessage('Invalid status'),
  checkValidation,
];

/**
 * Validation rules for confirmation / dispute vote
 */
export const validateConfirmationVote = [
  param('id').isMongoId().withMessage('Invalid issue ID'),
  body('vote').isIn(['confirm', 'dispute']).withMessage('Vote must be either confirm or dispute'),
  checkValidation,
];
