const express = require('express');
const {
  getRecommendations,
  generateReport,
  simulateScores,
  getTip,
  chat
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all AI routes
router.use(protect);

router.get('/recommendations', getRecommendations);
router.post('/report', generateReport);
router.post('/simulate', simulateScores);
router.get('/green-tip', getTip);
router.post('/chat', chat);

module.exports = router;
