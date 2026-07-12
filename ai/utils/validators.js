/**
 * validators.js
 * -----------------------------------------------------------------------
 * Input validation & sanitisation for all ESG data flowing into the AI
 * module. Every service should validate input BEFORE building a prompt or
 * touching the calculator — this keeps bad/missing data from silently
 * corrupting AI output or crashing the app.
 * -----------------------------------------------------------------------
 */

/**
 * Canonical shape of the ESG metrics object used across the module.
 * All fields are optional at the type level, but validateEsgData()
 * enforces which ones are required for a given feature.
 *
 * {
 *   environmentalScore:   number (0-100),
 *   socialScore:          number (0-100),
 *   governanceScore:      number (0-100),
 *   carbonEmissions:      number (tons CO2e, >= 0),
 *   electricityConsumption: number (kWh, >= 0),
 *   fuelConsumption:      number (litres, >= 0),
 *   csrParticipation:     number (%, 0-100),
 *   employeeEngagement:   number (%, 0-100),
 *   compliancePercentage: number (%, 0-100),
 *   auditStatus:          string ('completed' | 'pending' | 'in-progress' | 'overdue')
 * }
 */

const REQUIRED_FIELDS = [
  'environmentalScore',
  'socialScore',
  'governanceScore',
  'carbonEmissions',
  'electricityConsumption',
  'fuelConsumption',
  'csrParticipation',
  'employeeEngagement',
  'compliancePercentage',
  'auditStatus',
];

const PERCENT_FIELDS = [
  'environmentalScore',
  'socialScore',
  'governanceScore',
  'csrParticipation',
  'employeeEngagement',
  'compliancePercentage',
];

const NON_NEGATIVE_FIELDS = [
  'carbonEmissions',
  'electricityConsumption',
  'fuelConsumption',
];

const VALID_AUDIT_STATUSES = ['completed', 'pending', 'in-progress', 'overdue'];

/**
 * Validates an ESG data object.
 * @param {object} data - Raw ESG data (e.g. from a request body).
 * @param {object} [options]
 * @param {string[]} [options.requiredFields] - Override which fields are required.
 * @returns {{ valid: boolean, errors: string[], data: object }}
 *   `data` is returned with numeric fields coerced to Number when possible.
 */
function validateEsgData(data, options = {}) {
  const errors = [];
  const required = options.requiredFields || REQUIRED_FIELDS;

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['ESG data must be a non-null object.'], data: {} };
  }

  const cleaned = { ...data };

  // Check presence
  required.forEach((field) => {
    if (cleaned[field] === undefined || cleaned[field] === null || cleaned[field] === '') {
      errors.push(`Missing required field: "${field}".`);
    }
  });

  // Coerce & range-check numeric percentage fields
  PERCENT_FIELDS.forEach((field) => {
    if (cleaned[field] !== undefined && cleaned[field] !== null && cleaned[field] !== '') {
      const num = Number(cleaned[field]);
      if (Number.isNaN(num)) {
        errors.push(`Field "${field}" must be a number.`);
      } else if (num < 0 || num > 100) {
        errors.push(`Field "${field}" must be between 0 and 100 (got ${num}).`);
      } else {
        cleaned[field] = num;
      }
    }
  });

  // Coerce & check non-negative numeric fields
  NON_NEGATIVE_FIELDS.forEach((field) => {
    if (cleaned[field] !== undefined && cleaned[field] !== null && cleaned[field] !== '') {
      const num = Number(cleaned[field]);
      if (Number.isNaN(num)) {
        errors.push(`Field "${field}" must be a number.`);
      } else if (num < 0) {
        errors.push(`Field "${field}" cannot be negative (got ${num}).`);
      } else {
        cleaned[field] = num;
      }
    }
  });

  // Validate audit status enum (case-insensitive, normalised to lowercase)
  if (cleaned.auditStatus !== undefined && cleaned.auditStatus !== null) {
    const normalised = String(cleaned.auditStatus).toLowerCase().trim();
    if (!VALID_AUDIT_STATUSES.includes(normalised)) {
      errors.push(
        `Field "auditStatus" must be one of: ${VALID_AUDIT_STATUSES.join(', ')} (got "${cleaned.auditStatus}").`
      );
    } else {
      cleaned.auditStatus = normalised;
    }
  }

  return { valid: errors.length === 0, errors, data: cleaned };
}

/**
 * Validates a simple chat message payload for the chatbot service.
 * @param {object} payload
 * @param {string} payload.message
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateChatMessage(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('Payload must be an object with a "message" field.');
    return { valid: false, errors };
  }
  if (typeof payload.message !== 'string' || !payload.message.trim()) {
    errors.push('Field "message" must be a non-empty string.');
  } else if (payload.message.length > 2000) {
    errors.push('Field "message" exceeds the 2000 character limit.');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validates the partial data used by the ESG Score Simulator
 * (only the "what-if" fields the user is allowed to change).
 */
function validateSimulatorInput(data) {
  return validateEsgData(data, {
    requiredFields: [
      'electricityConsumption',
      'fuelConsumption',
      'csrParticipation',
      'compliancePercentage',
    ],
  });
}

module.exports = {
  REQUIRED_FIELDS,
  validateEsgData,
  validateChatMessage,
  validateSimulatorInput,
};
