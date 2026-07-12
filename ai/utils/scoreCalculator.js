/**
 * scoreCalculator.js
 * -----------------------------------------------------------------------
 * Deterministic (non-AI) scoring engine that powers the ESG Score
 * Simulator's instant "what-if" calculations. Kept separate from any
 * Gemini call so the simulator is instant, free, and fully offline-capable
 * — the AI layer (simulatorService.js) only adds a narrative explanation
 * on top of these numbers.
 *
 * NOTE: The exact weighting formula is a hackathon-reasonable approximation
 * intended to be transparent and easy to defend/demo. Swap in a real
 * scoring model later without touching any other file.
 * -----------------------------------------------------------------------
 */

/** Clamp a number between 0 and 100. */
function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

/**
 * Environmental score model.
 * Lower electricity/fuel consumption -> higher score.
 * Consumption values are normalised against a configurable "baseline"
 * (a reasonable industry-average benchmark) so the simulator responds
 * sensibly regardless of company size.
 */
function calculateEnvironmentalScore({ electricityConsumption, fuelConsumption, baseline = {} }) {
  const electricityBaseline = baseline.electricityConsumption || 10000; // kWh/month
  const fuelBaseline = baseline.fuelConsumption || 2000; // litres/month

  const electricityRatio = electricityConsumption / electricityBaseline;
  const fuelRatio = fuelConsumption / fuelBaseline;

  // 100 at zero consumption, decreasing as consumption rises past baseline.
  const electricityComponent = clampScore(100 - electricityRatio * 50);
  const fuelComponent = clampScore(100 - fuelRatio * 50);

  return Math.round(clampScore(electricityComponent * 0.5 + fuelComponent * 0.5));
}

/**
 * Social score model.
 * Driven by CSR participation and employee engagement.
 */
function calculateSocialScore({ csrParticipation, employeeEngagement = csrParticipation }) {
  return Math.round(clampScore(csrParticipation * 0.5 + employeeEngagement * 0.5));
}

/**
 * Governance score model.
 * Driven by compliance percentage and audit status.
 */
function calculateGovernanceScore({ compliancePercentage, auditStatus = 'pending' }) {
  const auditBonus = {
    completed: 10,
    'in-progress': 0,
    pending: -10,
    overdue: -25,
  };
  const bonus = auditBonus[String(auditStatus).toLowerCase()] ?? 0;
  return Math.round(clampScore(compliancePercentage + bonus));
}

/**
 * Overall ESG score — simple weighted average of the three pillars.
 * Weights can be tuned per industry; defaults are equal-weighted.
 */
function calculateOverallScore(environmental, social, governance, weights = {}) {
  const w = { environmental: 1 / 3, social: 1 / 3, governance: 1 / 3, ...weights };
  const total = environmental * w.environmental + social * w.social + governance * w.governance;
  return Math.round(clampScore(total));
}

/**
 * Maps a numeric overall score to a human-readable ESG rating band.
 */
function scoreToRating(overallScore) {
  if (overallScore >= 85) return 'AAA (Excellent)';
  if (overallScore >= 70) return 'AA (Strong)';
  if (overallScore >= 55) return 'A (Good)';
  if (overallScore >= 40) return 'BBB (Fair)';
  if (overallScore >= 25) return 'BB (Weak)';
  return 'B (Poor)';
}

/**
 * Runs the full simulator calculation given a set of "what-if" inputs.
 * @param {object} input - see validateSimulatorInput in validators.js
 * @param {object} [baseline] - optional industry baseline overrides
 * @returns {object} calculated scores + rating
 */
function runSimulation(input, baseline = {}) {
  const environmentalScore = calculateEnvironmentalScore({
    electricityConsumption: input.electricityConsumption,
    fuelConsumption: input.fuelConsumption,
    baseline,
  });

  const socialScore = calculateSocialScore({
    csrParticipation: input.csrParticipation,
    employeeEngagement: input.employeeEngagement,
  });

  const governanceScore = calculateGovernanceScore({
    compliancePercentage: input.compliancePercentage,
    auditStatus: input.auditStatus,
  });

  const overallScore = calculateOverallScore(environmentalScore, socialScore, governanceScore);

  return {
    environmentalScore,
    socialScore,
    governanceScore,
    overallScore,
    rating: scoreToRating(overallScore),
  };
}

module.exports = {
  clampScore,
  calculateEnvironmentalScore,
  calculateSocialScore,
  calculateGovernanceScore,
  calculateOverallScore,
  scoreToRating,
  runSimulation,
};
