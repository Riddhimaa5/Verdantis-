/**
 * simulatorService.js
 * -----------------------------------------------------------------------
 * Feature 3: ESG Score Simulator ("What-If Analysis").
 * The score math is instant and deterministic (utils/scoreCalculator.js)
 * so the UI can call this on every slider change without hitting the AI
 * API. An optional AI-generated narrative insight can be requested
 * separately via getSimulationInsight() so it doesn't block the
 * instant recalculation the UI needs.
 * -----------------------------------------------------------------------
 */

const { validateSimulatorInput } = require('../utils/validators');
const { runSimulation } = require('../utils/scoreCalculator');
const { callGeminiJson } = require('./geminiService');

/**
 * Instantly calculates Environmental/Social/Governance/Overall scores
 * for a given set of "what-if" inputs. Pure calculation — no AI call,
 * safe to run on every UI interaction (e.g. slider drag).
 * @param {object} rawInput - { electricityConsumption, fuelConsumption, csrParticipation, compliancePercentage, employeeEngagement?, auditStatus? }
 * @param {object} [baseline] - optional industry baseline overrides for normalisation.
 * @returns {{ success: boolean, result?: object, errors?: string[] }}
 */
function simulateEsgScores(rawInput, baseline = {}) {
  const { valid, errors, data } = validateSimulatorInput(rawInput);

  if (!valid) {
    return { success: false, errors };
  }

  const result = runSimulation(data, baseline);
  return { success: true, result };
}

/**
 * Optional AI layer: given a "before" and "after" simulation result,
 * generates a short natural-language explanation of the impact of the
 * changes. Intended to be called once the user is happy with a scenario,
 * not on every slider tick.
 * @param {object} before - previous ESG data/result
 * @param {object} after - new simulated result (from simulateEsgScores)
 * @returns {Promise<{ success: boolean, insight?: string, errors?: string[] }>}
 */
async function getSimulationInsight(before, after) {
  if (!before || !after) {
    return { success: false, errors: ['Both "before" and "after" scenarios are required.'] };
  }

  const prompt = `
You are Verdantis AI. A user adjusted ESG "what-if" simulator inputs.

Before: ${JSON.stringify(before)}
After: ${JSON.stringify(after)}

Task: In 1-2 sentences, explain in plain business language what changed and
why the overall ESG score moved the way it did. Be specific and concise.

Respond ONLY with valid JSON: { "insight": "string" }
`.trim();

  try {
    const result = await callGeminiJson(prompt);
    return { success: true, insight: result.insight || '' };
  } catch (err) {
    return { success: false, errors: [`Simulation insight failed: ${err.message}`] };
  }
}

module.exports = { simulateEsgScores, getSimulationInsight };
