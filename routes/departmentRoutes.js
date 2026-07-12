const express = require('express');
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createDepartmentValidator,
  updateDepartmentValidator,
  idParamValidator,
} = require('../validators/departmentValidator');

router.use(protect);

router
  .route('/')
  .get(getDepartments)
  .post(authorize('Admin'), createDepartmentValidator, validate, createDepartment);

router
  .route('/:id')
  .get(idParamValidator, validate, getDepartmentById)
  .put(authorize('Admin'), updateDepartmentValidator, validate, updateDepartment)
  .delete(authorize('Admin'), idParamValidator, validate, deleteDepartment);

module.exports = router;
