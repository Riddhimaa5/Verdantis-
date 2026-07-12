/**
 * index.js
 * -----------------------------------------------------------------------
 * Public entry point for the Verdantis AI module.
 * Import from this file only — internal file paths (services/, utils/,
 * prompts/) may change without notice, but these named exports are the
 * stable integration contract for the rest of the app (React, Odoo,
 * plain HTML/JS backend, etc).
 * -----------------------------------------------------------------------
 *
 * Example usage:
 *
 *   const { getEsgRecommendations, askVerdantisAI } = require('./ai');
 *
 *   const result = await getEsgRecommendations(esgData);
 *   if (result.success) console.log(result.recommendations);
 */

const { getEsgRecommendations } = require('./services/advisorService');
const { generateExecutiveReport } = require('./services/reportService');
const { simulateEsgScores, getSimulationInsight } = require('./services/simulatorService');
const { getGreenTip } = require('./services/greenTipService');
const { askVerdantisAI } = require('./services/chatbotService');
const { validateEsgData, validateSimulatorInput, validateChatMessage } = require('./utils/validators');

module.exports = {
  // Feature 1: AI ESG Advisor
  getEsgRecommendations,

  // Feature 2: AI Executive ESG Report Generator
  generateExecutiveReport,

  // Feature 3: ESG Score Simulator
  simulateEsgScores,
  getSimulationInsight,

  // Feature 4: Green Tip Generator
  getGreenTip,

  // Feature 5: AI Chat Assistant
  askVerdantisAI,

  // Shared validators, exposed in case the frontend/backend wants to
  // pre-validate data before calling the AI module.
  validateEsgData,
  validateSimulatorInput,
  validateChatMessage,
};
