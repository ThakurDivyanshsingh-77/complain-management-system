import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
export const getAnalytics = async (req, res, next) => {
  try {
    // Total complaints
    const totalComplaints = await Complaint.countDocuments();

    // Status breakdown
    const statusBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Category breakdown
    const categoryBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Priority breakdown
    const priorityBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total users
    const totalUsers = await User.countDocuments();

    // User role breakdown
    const userRoleBreakdown = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Average resolution time (in hours)
    const resolvedComplaints = await Complaint.find({
      status: 'resolved',
      resolvedAt: { $exists: true },
    });

    let avgResolutionTime = 0;
    if (resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((acc, complaint) => {
        const resTime = (complaint.resolvedAt - complaint.createdAt) / (1000 * 60 * 60);
        return acc + resTime;
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedComplaints.length);
    }

    // Recent complaints (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentComplaints = await Complaint.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Complaints trend (last 30 days, grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const complaintsTrend = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Staff performance
    const staffPerformance = await Complaint.aggregate([
      {
        $match: {
          assignedTo: { $exists: true, $ne: null },
          status: 'resolved',
        },
      },
      {
        $group: {
          _id: '$assignedTo',
          resolved: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'staff',
        },
      },
      {
        $unwind: '$staff',
      },
      {
        $project: {
          name: '$staff.name',
          email: '$staff.email',
          resolved: 1,
        },
      },
      {
        $sort: { resolved: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalComplaints,
          totalUsers,
          recentComplaints,
          avgResolutionTime,
        },
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        categoryBreakdown,
        priorityBreakdown,
        userRoleBreakdown,
        complaintsTrend,
        staffPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;

    // Search in name and email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users,
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
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's complaint statistics
    const totalComplaints = await Complaint.countDocuments({ userId: user._id });
    const pendingComplaints = await Complaint.countDocuments({
      userId: user._id,
      status: 'pending',
    });
    const resolvedComplaints = await Complaint.countDocuments({
      userId: user._id,
      status: 'resolved',
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        statistics: {
          totalComplaints,
          pendingComplaints,
          resolvedComplaints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status
 * @route   PUT /api/admin/users/:id/toggle-status
 * @access  Private (Admin)
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deactivating own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get staff list for assignment
 * @route   GET /api/admin/staff
 * @access  Private (Admin)
 */
export const getStaffList = async (req, res, next) => {
  try {
    const staff = await User.find({
      role: { $in: ['staff', 'admin'] },
      isActive: true,
    }).select('name email department role');

    res.status(200).json({
      success: true,
      data: {
        staff,
      },
    });
  } catch (error) {
    next(error);
  }
};
