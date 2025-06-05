const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');


router.get('/', authMiddleware, roleMiddleware('admin'), AuthController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware('admin'), userController.getUserById);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), AuthController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);
router.post('/', authMiddleware, roleMiddleware('admin'), userController.createUser);


module.exports = router;

