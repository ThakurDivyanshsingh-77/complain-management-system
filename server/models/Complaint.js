import mongoose from 'mongoose';

/**
 * Timeline Entry Schema
 * Tracks every status change and update made to a complaint
 */
const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
  },
  note: {
    type: String,
    trim: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Complaint Schema
 * Main schema for managing complaints in the system
 */
const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'IT',
          'Infrastructure',
          'Library',
          'Hostel',
          'Transport',
          'Canteen',
          'Academic',
          'Administrative',
          'Security',
          'Other',
        ],
        message: 'Please select a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    attachments: [
      {
        type: String, // URLs or file paths
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'resolved', 'rejected'],
        message: 'Invalid status',
      },
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Invalid priority level',
      },
      default: 'medium',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    timeline: [timelineSchema],
    resolutionNote: {
      type: String,
      trim: true,
      maxlength: [1000, 'Resolution note cannot exceed 1000 characters'],
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
complaintSchema.index({ userId: 1, status: 1 });
complaintSchema.index({ assignedTo: 1, status: 1 });
complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });

/**
 * Add timeline entry whenever status changes
 */
complaintSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    // Only add to timeline if status actually changed
    const lastTimeline = this.timeline[this.timeline.length - 1];
    
    if (!lastTimeline || lastTimeline.status !== this.status) {
      // Note: updatedBy should be set in the controller
      if (this._statusUpdatedBy) {
        this.timeline.push({
          status: this.status,
          note: this._statusUpdateNote || '',
          updatedBy: this._statusUpdatedBy,
        });
        
        // Clean up temporary properties
        delete this._statusUpdatedBy;
        delete this._statusUpdateNote;
      }
    }
    
    // Set resolvedAt timestamp
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
  }
  next();
});

/**
 * Virtual field for resolution time in hours
 */
complaintSchema.virtual('resolutionTime').get(function () {
  if (this.resolvedAt && this.createdAt) {
    return Math.round((this.resolvedAt - this.createdAt) / (1000 * 60 * 60)); // hours
  }
  return null;
});

/**
 * Ensure virtuals are included when converting to JSON
 */
complaintSchema.set('toJSON', { virtuals: true });
complaintSchema.set('toObject', { virtuals: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
