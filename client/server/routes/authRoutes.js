import express from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register route
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

// Update profile
router.put('/profile', authMiddleware, updateProfile);

export default router;
