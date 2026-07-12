const express = require('express');
const router = express.Router();

const { createAudit, getAudits, getAuditById, updateAudit, deleteAudit } = require('../controllers/auditController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createAuditValidator, idParamValidator } = require('../validators/auditValidator');

router.use(protect);

router
  .route('/')
  .get(getAudits)
  .post(authorize('Admin', 'Manager'), createAuditValidator, validate, createAudit);

router
  .route('/:id')
  .get(idParamValidator, validate, getAuditById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateAudit)
  .delete(authorize('Admin'), idParamValidator, validate, deleteAudit);

module.exports = router;
