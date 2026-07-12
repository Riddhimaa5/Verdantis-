
/**
 * geminiConfig.js
 * -----------------------------------------------------------------------
 * Centralised configuration for the Google Gemini API.
 * Keeping config in one place means models/keys can be swapped without
 * touching any business logic in services/.
 * -----------------------------------------------------------------------
 */

require('dotenv').config();

const GEMINI_CONFIG = {
  // API key must be supplied via environment variable — never hard-code it.
  apiKey: process.env.GEMINI_API_KEY || '',

  // Model name. "gemini-flash-latest" is Google's stable "always current"
  // alias for their fast model — it stays valid even as pinned dated
  // versions (e.g. gemini-2.5-flash) get deprecated over time.
  model: process.env.GEMINI_MODEL || 'gemini-flash-latest',

  // Base endpoint for the REST API (v1beta generateContent).
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',

  // Default generation parameters. Individual services can override these.
  defaultGenerationConfig: {
    temperature: 0.4,       // lower = more consistent/deterministic output
    topK: 40,
    topP: 0.95,
    // Newer Gemini models spend part of maxOutputTokens on internal
    // "thinking" before writing the actual answer. 2048 was enough for
    // the JSON content alone but not enough once thinking ate into it,
    // causing truncated/invalid JSON. Raise the ceiling and turn thinking
    // off — these are short structured-output tasks that don't need it.
    maxOutputTokens: 4096,
    thinkingConfig: { thinkingBudget: 0 },
    responseMimeType: 'application/json', // ask Gemini to return raw JSON
  },

  // Simple retry policy for transient network/API failures.
  retry: {
    maxAttempts: 3,
    backoffMs: 800,
  },
};

/**
 * Validates that the module is configured correctly before use.
 * Throws a descriptive error instead of failing deep inside a fetch call.
 */
function assertConfigured() {
  if (!GEMINI_CONFIG.apiKey) {
    throw new Error(
      'GEMINI_API_KEY is missing. Set it in your .env file or environment ' +
        'variables before calling any Verdantis AI service.'
    );
  }
}

module.exports = { GEMINI_CONFIG, assertConfigured };