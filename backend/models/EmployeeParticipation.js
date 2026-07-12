const mongoose = require('mongoose');

// Tracks employee participation in CSR activities
const employeeParticipationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    csrActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CSRActivity',
      required: true,
    },
    hoursContributed: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: String,
      default: 'Volunteer', // Volunteer, Organizer, Lead
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Registered', 'Attended', 'No Show'],
      default: 'Registered',
    },
  },
  { timestamps: true }
);

employeeParticipationSchema.index({ employee: 1, csrActivity: 1 }, { unique: true });

module.exports = mongoose.model('EmployeeParticipation', employeeParticipationSchema);
