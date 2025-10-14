/**
 * Authentication Routes
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').optional().isString(),
  ],
  AuthController.register
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  AuthController.login
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', AuthController.refresh);

/**
 * GET /api/auth/me
 * Get current user (protected)
 */
router.get('/me', authMiddleware, AuthController.me);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
