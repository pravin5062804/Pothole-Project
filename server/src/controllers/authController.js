import { User } from '../models/User.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, ward } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'citizen',
      phone,
      ward,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed demo accounts (Admin, Worker, Citizen) for instant testing
 * @route   POST /api/auth/seed-demo
 * @access  Public (Development)
 */
export const seedDemoUsers = async (req, res, next) => {
  try {
    const demoUsers = [
      {
        name: 'Municipal Admin',
        email: 'admin@civicreport.org',
        password: 'AdminPassword123!',
        role: 'admin',
        ward: 'Central Admin',
      },
      {
        name: 'Field Worker Ramesh',
        email: 'worker@civicreport.org',
        password: 'WorkerPassword123!',
        role: 'worker',
        ward: 'Ward A - Central',
      },
      {
        name: 'Citizen Priya',
        email: 'citizen@civicreport.org',
        password: 'CitizenPassword123!',
        role: 'citizen',
        ward: 'Ward A - Central',
      },
    ];

    const results = [];
    for (const u of demoUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
      }
      results.push({ email: u.email, role: u.role, defaultPassword: u.password });
    }

    res.status(200).json({
      success: true,
      message: 'Demo accounts ready.',
      accounts: results,
    });
  } catch (error) {
    next(error);
  }
};
