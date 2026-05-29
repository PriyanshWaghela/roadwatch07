import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';
import config from '../config/env';

const router = Router();

/**
 * Generate JWT token
 */
function generateToken(id: string): string {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  } as jwt.SignOptions);
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['citizen', 'authority'])
      .withMessage('Role must be citizen or authority'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role, phone, location } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'A user with this email already exists',
        });
        return;
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'citizen',
        phone,
        location,
      });

      // Generate token
      const token = generateToken(user._id.toString());

      // Return response (exclude password)
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        location: user.location,
        notificationPrefs: user.notificationPrefs,
        createdAt: user.createdAt,
      };

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: userResponse,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user by email and include password for comparison
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Generate token
      const token = generateToken(user._id.toString());

      // Return response (exclude password)
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        location: user.location,
        notificationPrefs: user.notificationPrefs,
        createdAt: user.createdAt,
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: userResponse,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get(
  '/me',
  protect,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user!._id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    body('phone')
      .optional()
      .trim(),
    body('avatar')
      .optional()
      .trim(),
    body('location.lat')
      .optional()
      .isNumeric()
      .withMessage('Latitude must be a number'),
    body('location.lng')
      .optional()
      .isNumeric()
      .withMessage('Longitude must be a number'),
    body('location.address')
      .optional()
      .trim(),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const allowedFields: Record<string, any> = {};

      if (req.body.name) allowedFields.name = req.body.name;
      if (req.body.phone !== undefined) allowedFields.phone = req.body.phone;
      if (req.body.avatar !== undefined) allowedFields.avatar = req.body.avatar;
      if (req.body.location) allowedFields.location = req.body.location;

      const user = await User.findByIdAndUpdate(req.user!._id, allowedFields, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password field
      const user = await User.findById(req.user!._id).select('+password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
        return;
      }

      // Update password (pre-save hook will hash it)
      user.password = newPassword;
      await user.save();

      // Generate new token
      const token = generateToken(user._id.toString());

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
