/**
 * reportPrompt.js
 * -----------------------------------------------------------------------
 * Prompt template for the AI Executive ESG Report Generator.
 * -----------------------------------------------------------------------
 */

/**
 * Builds the prompt sent to Gemini for a full executive ESG report.
 * @param {object} esg - validated ESG data
 * @param {object} [meta] - optional company metadata (name, industry, period)
 * @returns {string}
 */
function buildReportPrompt(esg, meta = {}) {
  const companyName = meta.companyName || 'the company';
  const industry = meta.industry || 'not specified';
  const period = meta.reportingPeriod || 'the current reporting period';

  return `
You are Verdantis AI, an ESG reporting analyst preparing a report for
senior executives and the board of directors.

Company: ${companyName}
Industry: ${industry}
Reporting Period: ${period}

ESG Data:
- Environmental Score: ${esg.environmentalScore}/100
- Social Score: ${esg.socialScore}/100
- Governance Score: ${esg.governanceScore}/100
- Carbon Emissions: ${esg.carbonEmissions} tons CO2e
- Electricity Consumption: ${esg.electricityConsumption} kWh
- Fuel Consumption: ${esg.fuelConsumption} litres
- CSR Participation: ${esg.csrParticipation}%
- Employee Engagement: ${esg.employeeEngagement}%
- Compliance Percentage: ${esg.compliancePercentage}%
- Audit Status: ${esg.auditStatus}

Task:
Produce a professional executive ESG report suitable for managers/executives.
Tone: formal, concise, data-driven. No fluff.

Respond ONLY with valid JSON in exactly this shape, no extra commentary:

{
  "executiveSummary": "string (3-5 sentences)",
  "environmentalAnalysis": "string (analysis referencing the environmental metrics)",
  "socialAnalysis": "string (analysis referencing the social metrics)",
  "governanceAnalysis": "string (analysis referencing the governance metrics)",
  "esgScoreSummary": {
    "environmentalScore": ${esg.environmentalScore},
    "socialScore": ${esg.socialScore},
    "governanceScore": ${esg.governanceScore},
    "overallScore": "number 0-100, your calculated weighted average"
  },
  "risksIdentified": ["string", "string", "..."],
  "recommendations": ["string", "string", "string", "string", "string"],
  "overallEsgRating": "string, e.g. AAA / AA / A / BBB / BB / B with one-line justification"
}
`.trim();
}

module.exports = { buildReportPrompt };
