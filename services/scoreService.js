const DepartmentESGScore = require('../models/DepartmentESGScore');
const CarbonTransaction = require('../models/CarbonTransaction');
const CSRActivity = require('../models/CSRActivity');
const EmployeeParticipation = require('../models/EmployeeParticipation');
const PolicyAcknowledgement = require('../models/PolicyAcknowledgement');
const Policy = require('../models/Policy');
const ComplianceIssue = require('../models/ComplianceIssue');
const User = require('../models/User');
const { SCORE_WEIGHTS } = require('../config/constants');

// Tunable divisor: how many kg of CO2e reduce the environmental score by 1 point.
const EMISSION_SCORE_DIVISOR = 10;

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

/**
 * Fetches (or lazily creates) the ESG score document for a department.
 */
const getOrCreateScoreDoc = async (departmentId) => {
  let doc = await DepartmentESGScore.findOne({ department: departmentId });
  if (!doc) {
    doc = await DepartmentESGScore.create({ department: departmentId });
  }
  return doc;
};

/**
 * Recalculates the Environmental score for a department based on total
 * carbon emissions recorded. Lower emissions => higher score.
 */
const recalcEnvironmentalScore = async (departmentId) => {
  const result = await CarbonTransaction.aggregate([
    { $match: { department: departmentId } },
    { $group: { _id: null, total: { $sum: '$carbonEmission' } } },
  ]);

  const totalCarbonEmission = result.length ? result[0].total : 0;
  const environmentalScore = clamp(100 - totalCarbonEmission / EMISSION_SCORE_DIVISOR);

  const doc = await getOrCreateScoreDoc(departmentId);
  doc.environmentalScore = environmentalScore;
  doc.totalCarbonEmission = totalCarbonEmission;
  await recalcOverall(doc);
  return doc;
};

/**
 * Recalculates the Social score for a department based on completed CSR
 * activities and employee participation hours.
 */
const recalcSocialScore = async (departmentId) => {
  const completedActivities = await CSRActivity.countDocuments({
    department: departmentId,
    status: 'Completed',
  });

  const activityIds = await CSRActivity.find({ department: departmentId }).distinct('_id');

  const participationAgg = await EmployeeParticipation.aggregate([
    { $match: { csrActivity: { $in: activityIds }, status: 'Attended' } },
    { $group: { _id: null, totalHours: { $sum: '$hoursContributed' } } },
  ]);

  const totalHours = participationAgg.length ? participationAgg[0].totalHours : 0;

  const socialScore = clamp(completedActivities * 5 + totalHours * 0.5);

  const doc = await getOrCreateScoreDoc(departmentId);
  doc.socialScore = socialScore;
  await recalcOverall(doc);
  return doc;
};

/**
 * Recalculates the Governance score for a department based on the policy
 * acknowledgement rate among its employees and the compliance issue
 * resolution rate.
 */
const recalcGovernanceScore = async (departmentId) => {
  const employees = await User.find({ department: departmentId }).select('_id');
  const employeeIds = employees.map((e) => e._id);

  const activePolicies = await Policy.countDocuments({ isActive: true, mandatoryAcknowledgement: true });
  let ackRate = 1;

  if (activePolicies > 0 && employeeIds.length > 0) {
    const expectedAcks = activePolicies * employeeIds.length;
    const actualAcks = await PolicyAcknowledgement.countDocuments({
      employee: { $in: employeeIds },
    });
    ackRate = clamp(actualAcks / expectedAcks, 0, 1);
  }

  const totalIssues = await ComplianceIssue.countDocuments({ department: departmentId });
  let resolutionRate = 1;
  if (totalIssues > 0) {
    const resolvedIssues = await ComplianceIssue.countDocuments({
      department: departmentId,
      status: 'Resolved',
    });
    resolutionRate = clamp(resolvedIssues / totalIssues, 0, 1);
  }

  const governanceScore = clamp(ackRate * 70 + resolutionRate * 30);

  const doc = await getOrCreateScoreDoc(departmentId);
  doc.governanceScore = governanceScore;
  await recalcOverall(doc);
  return doc;
};

/**
 * Combines the three pillar scores into a weighted overall ESG score.
 * Environmental 40%, Social 30%, Governance 30%.
 */
const recalcOverall = async (doc) => {
  doc.overallESGScore = clamp(
    doc.environmentalScore * SCORE_WEIGHTS.ENVIRONMENTAL +
      doc.socialScore * SCORE_WEIGHTS.SOCIAL +
      doc.governanceScore * SCORE_WEIGHTS.GOVERNANCE
  );
  doc.lastCalculatedAt = new Date();
  await doc.save();
  return doc;
};

/**
 * Recalculates all three pillar scores + overall for a department in one call.
 */
const recalcAllScores = async (departmentId) => {
  await recalcEnvironmentalScore(departmentId);
  await recalcSocialScore(departmentId);
  await recalcGovernanceScore(departmentId);
  return getOrCreateScoreDoc(departmentId);
};

/**
 * Computes a company-wide ESG summary by averaging every department's
 * live score document. Used by the /api/dashboard endpoint.
 */
const getGlobalESGSummary = async () => {
  const scores = await DepartmentESGScore.find();

  if (!scores.length) {
    return {
      overallESG: 0,
      environmentalScore: 0,
      socialScore: 0,
      governanceScore: 0,
      totalCarbonEmission: 0,
    };
  }

  const totals = scores.reduce(
    (acc, s) => {
      acc.environmentalScore += s.environmentalScore;
      acc.socialScore += s.socialScore;
      acc.governanceScore += s.governanceScore;
      acc.overallESGScore += s.overallESGScore;
      acc.totalCarbonEmission += s.totalCarbonEmission;
      return acc;
    },
    { environmentalScore: 0, socialScore: 0, governanceScore: 0, overallESGScore: 0, totalCarbonEmission: 0 }
  );

  const count = scores.length;

  return {
    overallESG: Number((totals.overallESGScore / count).toFixed(2)),
    environmentalScore: Number((totals.environmentalScore / count).toFixed(2)),
    socialScore: Number((totals.socialScore / count).toFixed(2)),
    governanceScore: Number((totals.governanceScore / count).toFixed(2)),
    totalCarbonEmission: Number(totals.totalCarbonEmission.toFixed(2)),
  };
};

module.exports = {
  recalcEnvironmentalScore,
  recalcSocialScore,
  recalcGovernanceScore,
  recalcAllScores,
  getGlobalESGSummary,
};
