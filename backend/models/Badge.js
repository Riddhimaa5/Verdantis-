const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '', // URL or icon identifier
    },
    xpRequired: {
      type: Number,
      required: [true, 'XP required to unlock this badge is required'],
      min: 0,
    },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Badge', badgeSchema);
