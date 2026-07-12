# Verdantis AI Module

AI-powered functionality for the **Verdantis ESG Management Platform**, built to be dropped into any frontend/backend (React, Odoo, plain HTML/JS, Express, etc.) as an independent, self-contained module.

This module owns **only** AI logic. It has no opinion about auth, databases, routing, or UI — the parent app is expected to fetch the ESG data, call these functions, and render the results.

---

## 1. Setup

```bash
cd ai-module        # wherever you place this folder in your repo
npm install
cp .env.example .env
# then edit .env and add your real GEMINI_API_KEY
```

Requires **Node.js 18+** (uses the built-in `fetch`).

Get a Gemini API key at: https://aistudio.google.com/app/apikey

Run the demo script (exercises all 5 features):

```bash
npm test
```

---

## 2. Folder Structure

```
ai/
│
├── prompts/              # Prompt templates only — no business logic
│   ├── advisorPrompt.js
│   ├── reportPrompt.js
│   ├── greenTipPrompt.js
│   └── chatbotPrompt.js
│
├── services/              # Business logic — validation + AI calls
│   ├── geminiService.js       # low-level Gemini API wrapper
│   ├── advisorService.js      # Feature 1
│   ├── reportService.js       # Feature 2
│   ├── simulatorService.js    # Feature 3
│   ├── greenTipService.js     # Feature 4
│   └── chatbotService.js      # Feature 5
│
├── utils/
│   ├── scoreCalculator.js # deterministic ESG scoring math
│   └── validators.js      # input validation/sanitisation
│
├── config/
│   └── geminiConfig.js    # API key, model name, generation defaults
│
├── test/
│   └── manualTest.js      # runnable demo of all 5 features
│
└── index.js               # ⭐ single import point for the whole module
```

**Integration rule of thumb:** only ever `require('./ai')` (i.e. `ai/index.js`). Internal files may be refactored; the exports below are the stable contract.

---

## 3. API Reference

Every function returns `{ success: boolean, ...data, errors?: string[] }`. Always check `success` before using the payload — invalid input or an AI failure never throws, it returns `success: false` with human-readable `errors`.

### ESG Data Shape (used by most functions)

```js
{
  environmentalScore: 58,        // 0-100
  socialScore: 72,               // 0-100
  governanceScore: 64,           // 0-100
  carbonEmissions: 1450,         // tons CO2e, >= 0
  electricityConsumption: 18500, // kWh, >= 0
  fuelConsumption: 3200,         // litres, >= 0
  csrParticipation: 45,          // %, 0-100
  employeeEngagement: 68,        // %, 0-100
  compliancePercentage: 61,      // %, 0-100
  auditStatus: 'pending'         // 'completed' | 'pending' | 'in-progress' | 'overdue'
}
```

### 1. `getEsgRecommendations(esgData)`

Returns exactly 5 ESG recommendations.

```js
const { getEsgRecommendations } = require('./ai');

const result = await getEsgRecommendations(esgData);
// { success: true, recommendations: [
//   { title: 'Reduce electricity consumption', detail: '...', priority: 'high' },
//   ... 5 total
// ] }
```

### 2. `generateExecutiveReport(esgData, meta?)`

`meta` (optional): `{ companyName, industry, reportingPeriod }`

```js
const result = await generateExecutiveReport(esgData, {
  companyName: 'Acme Ltd.',
  industry: 'Manufacturing',
  reportingPeriod: 'Q2 2026',
});
// { success: true, report: {
//   executiveSummary, environmentalAnalysis, socialAnalysis,
//   governanceAnalysis, esgScoreSummary, risksIdentified,
//   recommendations, overallEsgRating, generatedAt, ...
// } }
```

### 3. `simulateEsgScores(input, baseline?)` — instant, no AI call

For live "what-if" sliders. Pure math, safe to call on every UI change.

```js
const { simulateEsgScores } = require('./ai');

const result = simulateEsgScores({
  electricityConsumption: 12000,
  fuelConsumption: 2500,
  csrParticipation: 70,
  compliancePercentage: 85,
});
// { success: true, result: {
//   environmentalScore, socialScore, governanceScore, overallScore, rating
// } }
```

Optional AI narration once a user settles on a scenario:

```js
const { getSimulationInsight } = require('./ai');
const insight = await getSimulationInsight(beforeResult, afterResult);
// { success: true, insight: "Overall score rose 12 points, driven mainly by..." }
```

### 4. `getGreenTip(esgData)`

```js
const result = await getGreenTip(esgData);
// { success: true, tip: "Switching office lighting to LED bulbs could reduce..." }
```

### 5. `askVerdantisAI({ message, history?, esgContext? })`

Stateless chat — the caller stores and re-sends `history`.

```js
const { askVerdantisAI } = require('./ai');

let history = [];
const turn1 = await askVerdantisAI({
  message: 'How can we improve our ESG score?',
  esgContext: esgData, // optional, grounds answers in real numbers
});
history = turn1.history;

const turn2 = await askVerdantisAI({
  message: 'What about carbon emissions specifically?',
  history,
});
```

---

## 4. Integration Notes

- **React:** call these functions from a backend API route (never expose `GEMINI_API_KEY` to the browser). Wrap each in an Express/Next.js handler that just forwards `req.body` and returns the JSON result.
- **Odoo:** wrap `index.js` in a small Node microservice and call it from an Odoo controller via HTTP, or port the same prompt/service structure to Python if the integration needs to stay in-process.
- **Plain HTML/JS:** same as React — this module must run server-side; the frontend calls your backend endpoint, not this module directly.
- All functions are **async except `simulateEsgScores`**, which is synchronous by design for instant UI feedback.
- No database, session, or auth logic lives here by design — pass in whatever ESG data your backend already fetched.

---

## 5. Error Handling

- Invalid/missing input → `{ success: false, errors: ['Missing required field: "carbonEmissions".', ...] }`, no AI call is made.
- Gemini API failure (network, rate limit, bad key) → retried up to 3 times with backoff, then `{ success: false, errors: ['... failed: ...'] }`.
- `getEsgRecommendations` always returns exactly 5 items even if the AI returns fewer — deterministic fallbacks pad the list.
- `generateExecutiveReport` cross-checks the AI's overall score against a deterministic calculation and fills gaps if the AI omits them.

---

## 6. Extending

- To change AI wording: edit files in `ai/prompts/` only.
- To change scoring formulas: edit `ai/utils/scoreCalculator.js` only.
- To swap AI providers: only `ai/services/geminiService.js` and `ai/config/geminiConfig.js` need to change — every other file calls the provider-agnostic `callGemini*` functions.
