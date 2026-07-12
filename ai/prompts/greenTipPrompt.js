/**
 * greenTipPrompt.js
 * -----------------------------------------------------------------------
 * Prompt template for the single-tip Green Tip Generator.
 * -----------------------------------------------------------------------
 */

/**
 * Builds the prompt sent to Gemini for one sustainability tip.
 * @param {object} esg - validated ESG data
 * @returns {string}
 */
function buildGreenTipPrompt(esg) {
  return `
You are Verdantis AI, a sustainability advisor.

Based on this company's current ESG performance:
- Environmental Score: ${esg.environmentalScore}/100
- Carbon Emissions: ${esg.carbonEmissions} tons CO2e
- Electricity Consumption: ${esg.electricityConsumption} kWh
- Fuel Consumption: ${esg.fuelConsumption} litres
- CSR Participation: ${esg.csrParticipation}%
- Compliance Percentage: ${esg.compliancePercentage}%

Task:
Generate exactly ONE concise, specific, motivating sustainability tip,
similar in style to this example:
"Switching office lighting to LED bulbs could reduce annual carbon emissions by approximately 12%."

The tip should reference the weakest metric above and include a plausible
estimated impact (a rough percentage or figure) where reasonable.

Respond ONLY with valid JSON in exactly this shape, no extra commentary:

{
  "tip": "string, one sentence"
}
`.trim();
}

module.exports = { buildGreenTipPrompt };
