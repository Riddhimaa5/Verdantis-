/**
 * manualTest.js
 * -----------------------------------------------------------------------
 * Quick manual smoke-test / demo script for the hackathon.
 * Run with: node ai/test/manualTest.js
 * Requires a valid GEMINI_API_KEY in your .env file.
 * -----------------------------------------------------------------------
 */

const {
  getEsgRecommendations,
  generateExecutiveReport,
  simulateEsgScores,
  getGreenTip,
  askVerdantisAI,
} = require('../index');

const sampleCompany = {
  environmentalScore: 58,
  socialScore: 72,
  governanceScore: 64,
  carbonEmissions: 1450,
  electricityConsumption: 18500,
  fuelConsumption: 3200,
  csrParticipation: 45,
  employeeEngagement: 68,
  compliancePercentage: 61,
  auditStatus: 'pending',
};

async function main() {
  console.log('\n=== 1. AI ESG Advisor ===');
  const advisor = await getEsgRecommendations(sampleCompany);
  console.log(JSON.stringify(advisor, null, 2));

  console.log('\n=== 2. AI Executive ESG Report ===');
  const report = await generateExecutiveReport(sampleCompany, {
    companyName: 'Acme Manufacturing Ltd.',
    industry: 'Manufacturing',
    reportingPeriod: 'Q2 2026',
  });
  console.log(JSON.stringify(report, null, 2));

  console.log('\n=== 3. ESG Score Simulator (instant, no AI call) ===');
  const simulation = simulateEsgScores({
    electricityConsumption: 12000, // reduced from 18500
    fuelConsumption: 2500, // reduced from 3200
    csrParticipation: 70, // increased from 45
    compliancePercentage: 85, // increased from 61
    employeeEngagement: 68,
    auditStatus: 'in-progress',
  });
  console.log(JSON.stringify(simulation, null, 2));

  console.log('\n=== 4. Green Tip Generator ===');
  const tip = await getGreenTip(sampleCompany);
  console.log(JSON.stringify(tip, null, 2));

  console.log('\n=== 5. AI Chat Assistant ===');
  const chat = await askVerdantisAI({
    message: 'How can we improve our ESG score?',
    esgContext: sampleCompany,
  });
  console.log(JSON.stringify(chat, null, 2));
}

main().catch((err) => {
  console.error('Manual test failed:', err);
  process.exit(1);
});
