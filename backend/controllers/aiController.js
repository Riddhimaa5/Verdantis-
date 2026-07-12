const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const scoreService = require('../services/scoreService');

// Import the Verdantis AI module (local dependency installed via npm)
const {
  getEsgRecommendations,
  generateExecutiveReport,
  simulateEsgScores,
  getGreenTip,
  askVerdantisAI,
} = require('verdantis-ai');

/**
 * Helper to construct the esgData payload for the AI module.
 * We fetch real global scores and augment them with reasonable defaults
 * for fields not tracked in the current DB schema.
 */
const fetchEsgDataForAI = async () => {
  const globalScores = await scoreService.getGlobalESGSummary();
  
  return {
    environmentalScore: globalScores.environmentalScore || 50,
    socialScore: globalScores.socialScore || 50,
    governanceScore: globalScores.governanceScore || 50,
    carbonEmissions: globalScores.totalCarbonEmission || 1000,
    electricityConsumption: 15000, // Mocked for demonstration
    fuelConsumption: 2500,         // Mocked for demonstration
    csrParticipation: globalScores.socialScore || 40, // Proxy
    employeeEngagement: globalScores.socialScore || 60, // Proxy
    compliancePercentage: globalScores.governanceScore || 70, // Proxy
    auditStatus: 'completed'
  };
};

/**
 * @desc    Get actionable ESG recommendations from AI
 * @route   GET /api/ai/recommendations
 * @access  Private
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const esgData = await fetchEsgDataForAI();
  const result = await getEsgRecommendations(esgData);
  
  if (!result.success) {
    return res.status(500).json(new ApiResponse(500, null, 'Failed to generate recommendations', result.errors));
  }
  
  res.status(200).json(new ApiResponse(200, result.recommendations, 'Recommendations generated successfully'));
});

/**
 * @desc    Generate an AI-powered Executive ESG Report
 * @route   POST /api/ai/report
 * @access  Private
 */
const generateReport = asyncHandler(async (req, res) => {
  const { companyName, industry, reportingPeriod } = req.body;
  const esgData = await fetchEsgDataForAI();
  
  const result = await generateExecutiveReport(esgData, { companyName, industry, reportingPeriod });
  
  if (!result.success) {
    return res.status(500).json(new ApiResponse(500, null, 'Failed to generate report', result.errors));
  }
  
  res.status(200).json(new ApiResponse(200, result.report, 'Report generated successfully'));
});

/**
 * @desc    Simulate ESG Scores based on hypothetical inputs
 * @route   POST /api/ai/simulate
 * @access  Private
 */
const simulateScores = asyncHandler(async (req, res) => {
  // simulateEsgScores is synchronous
  const result = simulateEsgScores(req.body);
  
  if (!result.success) {
    return res.status(400).json(new ApiResponse(400, null, 'Simulation failed', result.errors));
  }
  
  res.status(200).json(new ApiResponse(200, result.result, 'Scores simulated successfully'));
});

/**
 * @desc    Get a quick Green Tip from AI
 * @route   GET /api/ai/green-tip
 * @access  Private
 */
const getTip = asyncHandler(async (req, res) => {
  const esgData = await fetchEsgDataForAI();
  const result = await getGreenTip(esgData);
  
  if (!result.success) {
    return res.status(500).json(new ApiResponse(500, null, 'Failed to get green tip', result.errors));
  }
  
  res.status(200).json(new ApiResponse(200, { tip: result.tip }, 'Green tip fetched successfully'));
});

/**
 * @desc    Chat with the Verdantis AI Assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  const esgContext = await fetchEsgDataForAI();
  
  const result = await askVerdantisAI({ message, history, esgContext });
  
  if (!result.success) {
    return res.status(500).json(new ApiResponse(500, null, 'Failed to process chat message', result.errors));
  }
  
  res.status(200).json(new ApiResponse(200, { reply: result.reply, history: result.history }, 'Chat response generated successfully'));
});

module.exports = {
  getRecommendations,
  generateReport,
  simulateScores,
  getTip,
  chat
};
