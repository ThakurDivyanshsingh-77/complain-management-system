import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  updateComplaintPriority,
  deleteComplaint,
  createComplaintValidation,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint with file attachments
 * @access  Private (User)
 */
router.post(
  '/',
  protect,
  upload.array('attachments', 5), // Max 5 files
  handleMulterError,
  createComplaintValidation,
  createComplaint
);

/**
 * @route   GET /api/complaints/my
 * @desc    Get complaints for current user
 * @access  Private (User)
 */
router.get('/my', protect, getMyComplaints);

/**
 * @route   GET /api/complaints/all
 * @desc    Get all complaints (filtered for staff)
 * @access  Private (Admin/Staff)
 */
router.get('/all', protect, authorize('admin', 'staff'), getAllComplaints);

/**
 * @route   GET /api/complaints/:id
 * @desc    Get single complaint by ID
 * @access  Private
 */
router.get('/:id', protect, getComplaintById);

/**
 * @route   PUT /api/complaints/:id/status
 * @desc    Update complaint status
 * @access  Private (Admin/Staff)
 */
router.put(
  '/:id/status',
  protect,
  authorize('admin', 'staff'),
  updateComplaintStatus
);

/**
 * @route   PUT /api/complaints/:id/assign
 * @desc    Assign complaint to staff
 * @access  Private (Admin)
 */
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);

/**
 * @route   PUT /api/complaints/:id/priority
 * @desc    Update complaint priority
 * @access  Private (Admin)
 */
router.put(
  '/:id/priority',
  protect,
  authorize('admin'),
  updateComplaintPriority
);

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete complaint
 * @access  Private (Admin)
 */
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

export default router;
