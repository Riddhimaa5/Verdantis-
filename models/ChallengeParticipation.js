const mongoose = require('mongoose');

const challengeParticipationSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Registered', 'In Progress', 'Completed', 'Dropped'],
      default: 'Registered',
    },
    progress: {
      type: Number,
      default: 0, // percentage 0-100
      min: 0,
      max: 100,
    },
    xpAwarded: {
      type: Number,
      default: 0,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

challengeParticipationSchema.index({ challenge: 1, employee: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeParticipation', challengeParticipationSchema);
