const express = require('express');
const router = express.Router();

const { createBadge, getBadges, getBadgeById, updateBadge, deleteBadge } = require('../controllers/badgeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createBadgeValidator, idParamValidator } = require('../validators/badgeValidator');

router.use(protect);

router
  .route('/')
  .get(getBadges)
  .post(authorize('Admin'), createBadgeValidator, validate, createBadge);

router
  .route('/:id')
  .get(idParamValidator, validate, getBadgeById)
  .put(authorize('Admin'), idParamValidator, validate, updateBadge)
  .delete(authorize('Admin'), idParamValidator, validate, deleteBadge);

module.exports = router;
