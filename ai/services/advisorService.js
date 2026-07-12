/**
 * advisorService.js
 * -----------------------------------------------------------------------
 * Feature 1: AI ESG Advisor.
 * Given a company's ESG metrics, returns exactly 5 actionable
 * recommendations. This is the entry point the main app should call —
 * it handles validation, prompt building, the AI call, and response
 * shape guarantees in one place.
 * -----------------------------------------------------------------------
 */

const { buildAdvisorPrompt } = require('../prompts/advisorPrompt');
const { callGeminiJson } = require('./geminiService');
const { validateEsgData } = require('../utils/validators');

/**
 * Generates exactly 5 ESG recommendations for the given company data.
 * @param {object} rawEsgData - unvalidated ESG metrics from the caller.
 * @returns {Promise<{ success: boolean, recommendations?: Array, errors?: string[] }>}
 */
async function getEsgRecommendations(rawEsgData) {
  const { valid, errors, data } = validateEsgData(rawEsgData);

  if (!valid) {
    return { success: false, errors };
  }

  try {
    const prompt = buildAdvisorPrompt(data);
    const result = await callGeminiJson(prompt);

    let recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];

    // Guarantee exactly 5 items even if the model over/under-delivers.
    if (recommendations.length > 5) {
      recommendations = recommendations.slice(0, 5);
    } else if (recommendations.length < 5) {
      const fallbacks = getFallbackRecommendations(data).filter(
        (fb) => !recommendations.some((r) => r.title === fb.title)
      );
      recommendations = recommendations.concat(fallbacks).slice(0, 5);
    }

    return { success: true, recommendations };
  } catch (err) {
    return { success: false, errors: [`AI Advisor failed: ${err.message}`] };
  }
}

/**
 * Deterministic fallback recommendations, used only to pad out a
 * short/failed AI response so the caller always gets exactly 5 items.
 * @param {object} esg
 * @returns {Array<{title: string, detail: string, priority: string}>}
 */
function getFallbackRecommendations(esg) {
  const pool = [
    {
      title: 'Reduce electricity consumption',
      detail: 'Audit high-usage equipment and switch to energy-efficient alternatives.',
      priority: 'high',
    },
    {
      title: 'Increase employee CSR participation',
      detail: 'Launch structured volunteering programs with participation tracking.',
      priority: 'medium',
    },
    {
      title: 'Encourage paperless operations',
      detail: 'Digitise recurring paper-based workflows across departments.',
      priority: 'medium',
    },
    {
      title: 'Improve recycling initiatives',
      detail: 'Introduce clearly labelled recycling stations at all office locations.',
      priority: 'low',
    },
    {
      title: 'Complete pending compliance policies',
      detail: 'Prioritise outstanding audit items to close governance gaps.',
      priority: 'high',
    },
  ];

  // Prioritise fallbacks relevant to weak metrics first.
  return pool.sort((a, b) => {
    const score = (item) => {
      if (item.title.includes('compliance') && esg.compliancePercentage < 70) return -1;
      if (item.title.includes('electricity') && esg.environmentalScore < 60) return -1;
      if (item.title.includes('CSR') && esg.csrParticipation < 60) return -1;
      return 0;
    };
    return score(a) - score(b);
  });
}

module.exports = { getEsgRecommendations };
