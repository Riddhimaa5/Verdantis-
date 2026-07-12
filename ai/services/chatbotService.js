/**
 * chatbotService.js
 * -----------------------------------------------------------------------
 * Feature 5: AI Chat Assistant ("Verdantis AI").
 * Stateless by design (like the rest of this module) — the caller
 * (frontend/backend) is responsible for persisting and passing back
 * conversation history. This keeps the AI module free of any database
 * dependency, per the project's separation of responsibilities.
 * -----------------------------------------------------------------------
 */

const { buildChatSystemPrompt } = require('../prompts/chatbotPrompt');
const { callGeminiChat } = require('./geminiService');
const { validateChatMessage, validateEsgData } = require('../utils/validators');

/**
 * Sends a user message to Verdantis AI and returns its reply.
 * @param {object} params
 * @param {string} params.message - the new user message.
 * @param {Array<{role: 'user'|'model', text: string}>} [params.history] - prior turns, oldest first.
 * @param {object} [params.esgContext] - optional ESG data to ground answers in.
 * @returns {Promise<{ success: boolean, reply?: string, history?: Array, errors?: string[] }>}
 */
async function askVerdantisAI({ message, history = [], esgContext = null }) {
  const { valid, errors } = validateChatMessage({ message });
  if (!valid) {
    return { success: false, errors };
  }

  let groundingData = null;
  if (esgContext) {
    const check = validateEsgData(esgContext);
    if (check.valid) {
      groundingData = check.data;
    }
    // If esgContext is invalid/partial, we silently proceed without it
    // rather than blocking the chat — grounding is a nice-to-have, not
    // a requirement for answering general ESG questions.
  }

  try {
    const systemInstruction = buildChatSystemPrompt(groundingData);
    const newHistory = [...history, { role: 'user', text: message }];

    const reply = await callGeminiChat(newHistory, systemInstruction);

    const updatedHistory = [...newHistory, { role: 'model', text: reply }];

    return { success: true, reply, history: updatedHistory };
  } catch (err) {
    return { success: false, errors: [`Chat assistant failed: ${err.message}`] };
  }
}

module.exports = { askVerdantisAI };
