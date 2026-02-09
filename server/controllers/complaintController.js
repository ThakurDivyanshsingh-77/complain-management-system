import Complaint from '../models/Complaint.js';
import { body, validationResult } from 'express-validator';

/**
 * Validation rules for creating a complaint
 */
export const createComplaintValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['IT', 'Infrastructure', 'Library', 'Hostel', 'Transport', 'Canteen', 'Academic', 'Administrative', 'Security', 'Other'])
    .withMessage('Invalid category'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
];

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Private (User)
 */
export const createComplaint = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    const { title, category, description, priority } = req.body;

    // Handle file attachments
    const attachments = req.files ? req.files.map(file => file.filename) : [];

    // Create complaint
    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      category,
      description,
      priority: priority || 'medium',
      attachments,
      timeline: [{
        status: 'pending',
        note: 'Complaint submitted',
        updatedBy: req.user._id,
      }],
    });

    // Populate user details
    await complaint.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaints for current user
 * @route   GET /api/complaints/my
 * @access  Private (User)
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get complaints with pagination
    const complaints = await Complaint.find(filter)
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints (Admin/Staff)
 * @route   GET /api/complaints/all
 * @access  Private (Admin/Staff)
 */
export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, assignedTo, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    
    // If user is staff, only show assigned complaints
    if (req.user.role === 'staff') {
      filter.assignedTo = req.user._id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get complaints with pagination
    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email department')
      .populate('timeline.updatedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check authorization
    // Users can only view their own complaints
    // Staff can view assigned complaints
    // Admin can view all complaints
    if (
      req.user.role === 'user' &&
      complaint.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    if (
      req.user.role === 'staff' &&
      (!complaint.assignedTo || complaint.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint status
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Admin/Staff)
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check authorization for staff
    if (
      req.user.role === 'staff' &&
      (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint',
      });
    }

    // Set temporary properties for pre-save hook
    complaint._statusUpdatedBy = req.user._id;
    complaint._statusUpdateNote = note || '';
    complaint.status = status;

    if (status === 'resolved' && note) {
      complaint.resolutionNote = note;
    }

    await complaint.save();

    // Populate for response
    await complaint.populate('userId', 'name email');
    await complaint.populate('assignedTo', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign complaint to staff (Admin only)
 * @route   PUT /api/complaints/:id/assign
 * @access  Private (Admin)
 */
export const assignComplaint = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Staff ID is required',
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    complaint.assignedTo = assignedTo;
    
    // Add timeline entry
    complaint.timeline.push({
      status: complaint.status,
      note: 'Complaint assigned',
      updatedBy: req.user._id,
    });

    await complaint.save();

    // Populate for response
    await complaint.populate('userId', 'name email');
    await complaint.populate('assignedTo', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update complaint priority (Admin only)
 * @route   PUT /api/complaints/:id/priority
 * @access  Private (Admin)
 */
export const updateComplaintPriority = async (req, res, next) => {
  try {
    const { priority } = req.body;

    if (!priority) {
      return res.status(400).json({
        success: false,
        message: 'Priority is required',
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    complaint.priority = priority;
    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint priority updated successfully',
      data: {
        complaint,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete complaint (Admin only)
 * @route   DELETE /api/complaints/:id
 * @access  Private (Admin)
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
