/**
 * geminiService.js
 * -----------------------------------------------------------------------
 * Low-level wrapper around the Google Gemini REST API. Every other
 * service in this module calls through here — nothing else should touch
 * `fetch` or know about Gemini's request/response shape directly. This
 * keeps the module easy to port to a different provider later.
 * -----------------------------------------------------------------------
 */

const { GEMINI_CONFIG, assertConfigured } = require('../config/geminiConfig');

/** Small sleep helper for retry backoff. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls the Gemini generateContent endpoint with a single user prompt.
 * @param {string} prompt - the full prompt text to send.
 * @param {object} [options]
 * @param {string} [options.systemInstruction] - optional system prompt.
 * @param {object} [options.generationConfig] - overrides for generation params.
 * @returns {Promise<string>} raw text returned by the model.
 */
async function callGemini(prompt, options = {}) {
  assertConfigured();

  const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      ...GEMINI_CONFIG.defaultGenerationConfig,
      ...options.generationConfig,
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      role: 'system',
      parts: [{ text: options.systemInstruction }],
    };
  }

  let lastError;
  for (let attempt = 1; attempt <= GEMINI_CONFIG.retry.maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Gemini API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n');

      if (!text) {
        throw new Error('Gemini API returned an empty response.');
      }

      return text;
    } catch (err) {
      lastError = err;
      if (attempt < GEMINI_CONFIG.retry.maxAttempts) {
        await sleep(GEMINI_CONFIG.retry.backoffMs * attempt);
      }
    }
  }

  throw new Error(`Gemini API call failed after ${GEMINI_CONFIG.retry.maxAttempts} attempts: ${lastError.message}`);
}

/**
 * Scans a string and returns the substring spanning the first complete,
 * balanced {...} JSON object — ignoring any braces/text that come after
 * it. This protects against models that occasionally emit a stray
 * trailing character after otherwise-valid JSON.
 * @param {string} text
 * @returns {string|null}
 */
function extractFirstJsonObject(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null; // no balanced object found (likely truncated)
}

/**
 * Calls Gemini and parses the response as JSON, since most of this
 * module's prompts request `responseMimeType: application/json`.
 * @param {string} prompt
 * @param {object} [options]
 * @returns {Promise<object>}
 */
async function callGeminiJson(prompt, options = {}) {
  const raw = await callGemini(prompt, options);

  // Defensive cleanup: strip markdown code fences if the model adds them
  // despite the JSON response mime type being requested.
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (firstErr) {
    // Fallback: extract just the first balanced {...} block in case the
    // model appended stray trailing characters after valid JSON.
    const extracted = extractFirstJsonObject(cleaned);
    if (extracted) {
      try {
        return JSON.parse(extracted);
      } catch (secondErr) {
        // fall through to the error below
      }
    }
    throw new Error(`Failed to parse Gemini JSON response: ${firstErr.message}\nRaw response: ${cleaned}`);
  }
}

/**
 * Multi-turn chat call. Sends the full conversation history each time
 * (Gemini/stateless REST calls have no server-side memory between calls).
 * @param {Array<{role: 'user'|'model', text: string}>} history
 * @param {string} [systemInstruction]
 * @returns {Promise<string>} the assistant's reply text.
 */
async function callGeminiChat(history, systemInstruction) {
  assertConfigured();

  const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`;

  const body = {
    contents: history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    generationConfig: {
      temperature: 0.6,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      // Note: no responseMimeType here — chat replies are free-form text.
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      role: 'system',
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n');

  if (!text) {
    throw new Error('Gemini API returned an empty chat response.');
  }

  return text.trim();
}

module.exports = { callGemini, callGeminiJson, callGeminiChat };