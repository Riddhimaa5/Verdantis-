const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    pointsCost: {
      type: Number,
      required: [true, 'Points cost is required'],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Log of redemptions for auditing/history
    redemptions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        redeemedAt: { type: Date, default: Date.now },
        pointsSpent: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reward', rewardSchema);
