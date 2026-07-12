const mongoose = require('mongoose');

const policyAcknowledgementSchema = new mongoose.Schema(
  {
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Policy',
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acknowledgedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

policyAcknowledgementSchema.index({ policy: 1, employee: 1 }, { unique: true });

module.exports = mongoose.model('PolicyAcknowledgement', policyAcknowledgementSchema);
