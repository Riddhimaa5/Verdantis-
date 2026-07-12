const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Audit title is required'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    auditType: {
      type: String,
      enum: ['Environmental', 'Social', 'Governance', 'Financial', 'General'],
      default: 'General',
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed'],
      default: 'Scheduled',
    },
    findings: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audit', auditSchema);
