import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getStaffList,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin-only
router.use(protect);
router.use(authorize('admin'));

/**
 * @route   GET /api/admin/analytics
 * @desc    Get dashboard analytics
 * @access  Private (Admin)
 */
router.get('/analytics', getAnalytics);

/**
 * @route   GET /api/admin/staff
 * @desc    Get staff list for assignment
 * @access  Private (Admin)
 */
router.get('/staff', getStaffList);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filters
 * @access  Private (Admin)
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID with statistics
 * @access  Private (Admin)
 */
router.get('/users/:id', getUserById);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
router.put('/users/:id/role', updateUserRole);

/**
 * @route   PUT /api/admin/users/:id/toggle-status
 * @desc    Toggle user active status
 * @access  Private (Admin)
 */
router.put('/users/:id/toggle-status', toggleUserStatus);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete('/users/:id', deleteUser);

export default router;
