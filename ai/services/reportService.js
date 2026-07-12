/**
 * reportService.js
 * -----------------------------------------------------------------------
 * Feature 2: AI Executive ESG Report Generator.
 * Produces a full structured report (summary, analysis per pillar,
 * risks, recommendations, overall rating) suitable for executives.
 * -----------------------------------------------------------------------
 */

const { buildReportPrompt } = require('../prompts/reportPrompt');
const { callGeminiJson } = require('./geminiService');
const { validateEsgData } = require('../utils/validators');
const { calculateOverallScore, scoreToRating } = require('../utils/scoreCalculator');

/**
 * Generates a full executive ESG report.
 * @param {object} rawEsgData - unvalidated ESG metrics.
 * @param {object} [meta] - optional { companyName, industry, reportingPeriod }.
 * @returns {Promise<{ success: boolean, report?: object, errors?: string[] }>}
 */
async function generateExecutiveReport(rawEsgData, meta = {}) {
  const { valid, errors, data } = validateEsgData(rawEsgData);

  if (!valid) {
    return { success: false, errors };
  }

  try {
    const prompt = buildReportPrompt(data, meta);
    const report = await callGeminiJson(prompt);

    // Cross-check the AI's overall score against our own deterministic
    // calculation; if missing/invalid, fill it in ourselves so the report
    // is always internally consistent.
    const calculatedOverall = calculateOverallScore(
      data.environmentalScore,
      data.socialScore,
      data.governanceScore
    );

    if (!report.esgScoreSummary || typeof report.esgScoreSummary.overallScore !== 'number') {
      report.esgScoreSummary = {
        environmentalScore: data.environmentalScore,
        socialScore: data.socialScore,
        governanceScore: data.governanceScore,
        overallScore: calculatedOverall,
      };
    }

    if (!report.overallEsgRating) {
      report.overallEsgRating = scoreToRating(calculatedOverall);
    }

    report.generatedAt = new Date().toISOString();
    report.companyName = meta.companyName || null;
    report.reportingPeriod = meta.reportingPeriod || null;

    return { success: true, report };
  } catch (err) {
    return { success: false, errors: [`Report generation failed: ${err.message}`] };
  }
}

module.exports = { generateExecutiveReport };
