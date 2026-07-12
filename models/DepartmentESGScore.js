const mongoose = require('mongoose');

// Stores current live ESG score snapshot per department.
// Recalculated automatically by scoreService on relevant events.
const departmentESGScoreSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      unique: true,
    },
    environmentalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    socialScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    governanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallESGScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalCarbonEmission: {
      type: Number,
      default: 0,
    },
    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DepartmentESGScore', departmentESGScoreSchema);
