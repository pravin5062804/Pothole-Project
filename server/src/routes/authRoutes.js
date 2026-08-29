import express from 'express';
import { register, login, getMe, seedDemoUsers } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimit.js';
import { validateRegister, validateLogin } from '../middlewares/validate.js';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.post('/seed-demo', seedDemoUsers);

export default router;
