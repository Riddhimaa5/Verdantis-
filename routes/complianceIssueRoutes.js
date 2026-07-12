const express = require('express');
const router = express.Router();

const {
  createComplianceIssue,
  getComplianceIssues,
  getComplianceIssueById,
  updateComplianceIssue,
  deleteComplianceIssue,
} = require('../controllers/complianceIssueController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createComplianceIssueValidator, idParamValidator } = require('../validators/complianceIssueValidator');

router.use(protect);

router
  .route('/')
  .get(getComplianceIssues)
  .post(authorize('Admin', 'Manager', 'Employee'), createComplianceIssueValidator, validate, createComplianceIssue);

router
  .route('/:id')
  .get(idParamValidator, validate, getComplianceIssueById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateComplianceIssue)
  .delete(authorize('Admin'), idParamValidator, validate, deleteComplianceIssue);

module.exports = router;
