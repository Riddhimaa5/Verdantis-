const mongoose = require('mongoose');

const complianceIssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    relatedAudit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Audit',
      default: null,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Review', 'Resolved', 'Escalated'],
      default: 'Open',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ComplianceIssue', complianceIssueSchema);
