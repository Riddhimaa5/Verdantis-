/**
 * greenTipService.js
 * -----------------------------------------------------------------------
 * Feature 4: Green Tip Generator.
 * Returns a single, specific sustainability tip based on current ESG
 * performance — e.g. for a homepage widget or daily-tip notification.
 * -----------------------------------------------------------------------
 */

const { buildGreenTipPrompt } = require('../prompts/greenTipPrompt');
const { callGeminiJson } = require('./geminiService');
const { validateEsgData } = require('../utils/validators');

/**
 * Generates one sustainability tip for the given ESG data.
 * @param {object} rawEsgData
 * @returns {Promise<{ success: boolean, tip?: string, errors?: string[] }>}
 */
async function getGreenTip(rawEsgData) {
  const { valid, errors, data } = validateEsgData(rawEsgData);

  if (!valid) {
    return { success: false, errors };
  }

  try {
    const prompt = buildGreenTipPrompt(data);
    const result = await callGeminiJson(prompt);

    const tip = typeof result.tip === 'string' && result.tip.trim()
      ? result.tip.trim()
      : 'Consider an energy audit to identify quick wins for reducing consumption and emissions.';

    return { success: true, tip };
  } catch (err) {
    return { success: false, errors: [`Green tip generation failed: ${err.message}`] };
  }
}

module.exports = { getGreenTip };
