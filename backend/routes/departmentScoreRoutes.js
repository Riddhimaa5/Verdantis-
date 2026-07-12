const express = require('express');
const router = express.Router();

const {
  getAllDepartmentScores,
  getDepartmentScore,
  recalculateDepartmentScore,
} = require('../controllers/departmentScoreController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getAllDepartmentScores);
router.get('/:departmentId', getDepartmentScore);
router.post('/:departmentId/recalculate', authorize('Admin', 'Manager'), recalculateDepartmentScore);

module.exports = router;
