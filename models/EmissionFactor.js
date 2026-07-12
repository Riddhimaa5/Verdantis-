const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema(
  {
    activityType: {
      type: String,
      required: [true, 'Activity type is required'], // e.g. Electricity, Fuel, Travel, Water
      trim: true,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'], // e.g. kWh, litre, km, kg
      trim: true,
    },
    factorValue: {
      type: Number,
      required: [true, 'Emission factor value (kg CO2e per unit) is required'],
      min: 0,
    },
    scope: {
      type: String,
      enum: ['Scope 1', 'Scope 2', 'Scope 3'],
      default: 'Scope 1',
    },
    source: {
      type: String,
      default: 'Default', // e.g. GHG Protocol, EPA, DEFRA
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmissionFactor', emissionFactorSchema);
