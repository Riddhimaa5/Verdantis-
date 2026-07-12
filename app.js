const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const emissionFactorRoutes = require('./routes/emissionFactorRoutes');
const esgGoalRoutes = require('./routes/esgGoalRoutes');
const carbonTransactionRoutes = require('./routes/carbonTransactionRoutes');
const csrActivityRoutes = require('./routes/csrActivityRoutes');
const participationRoutes = require('./routes/participationRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const challengeParticipationRoutes = require('./routes/challengeParticipationRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const policyRoutes = require('./routes/policyRoutes');
const policyAcknowledgementRoutes = require('./routes/policyAcknowledgementRoutes');
const auditRoutes = require('./routes/auditRoutes');
const complianceIssueRoutes = require('./routes/complianceIssueRoutes');
const departmentScoreRoutes = require('./routes/departmentScoreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------- Health Check ----------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Verdantis ESG Management Platform API is running 🌱',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/emission-factors', emissionFactorRoutes);
app.use('/api/esg-goals', esgGoalRoutes);
app.use('/api/carbon-transactions', carbonTransactionRoutes);
app.use('/api/csr-activities', csrActivityRoutes);
app.use('/api/participations', participationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/challenge-participations', challengeParticipationRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/policy-acknowledgements', policyAcknowledgementRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/compliance-issues', complianceIssueRoutes);
app.use('/api/department-scores', departmentScoreRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
