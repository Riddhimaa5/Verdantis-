// Centralized application-wide constants

module.exports = {
  ROLES: {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
  },

  SCORE_WEIGHTS: {
    ENVIRONMENTAL: 0.4,
    SOCIAL: 0.3,
    GOVERNANCE: 0.3,
  },

  CHALLENGE_STATUS: {
    ACTIVE: 'Active',
    UPCOMING: 'Upcoming',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  },

  PARTICIPATION_STATUS: {
    REGISTERED: 'Registered',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    DROPPED: 'Dropped',
  },

  COMPLIANCE_STATUS: {
    OPEN: 'Open',
    IN_REVIEW: 'In Review',
    RESOLVED: 'Resolved',
    ESCALATED: 'Escalated',
  },

  AUDIT_STATUS: {
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  },

  NOTIFICATION_TYPES: {
    CARBON_TRANSACTION: 'CarbonTransaction',
    CSR_ACTIVITY: 'CSRActivity',
    POLICY: 'Policy',
    COMPLIANCE: 'Compliance',
    CHALLENGE: 'Challenge',
    BADGE: 'Badge',
    REWARD: 'Reward',
    AUDIT: 'Audit',
    GENERAL: 'General',
  },
};
