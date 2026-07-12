const express = require('express');
const router = express.Router();

const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { idParamValidator, updateUserValidator } = require('../validators/userValidator');

router.use(protect);

router.get('/', authorize('Admin', 'Manager'), getUsers);
router.get('/:id', idParamValidator, validate, getUserById);
router.put('/:id', updateUserValidator, validate, updateUser);
router.delete('/:id', authorize('Admin'), idParamValidator, validate, deleteUser);

module.exports = router;
