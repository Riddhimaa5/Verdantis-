const mongoose = require('mongoose');

const csrActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Education', 'Health', 'Environment', 'Community', 'Disaster Relief', 'Other'],
      default: 'Other',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    organizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityDate: {
      type: Date,
      required: [true, 'Activity date is required'],
    },
    location: {
      type: String,
      default: '',
    },
    beneficiaryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    socialImpactScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['Planned', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Planned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CSRActivity', csrActivitySchema);
