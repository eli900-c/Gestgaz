const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.post('/register', authMiddleware, roleMiddleware('admin'),body('email').isEmail(),body('password').isLength({ min: 6 }),AuthController.register);
router.post('/login', body('email').isEmail(),body('password').notEmpty(), AuthController.login);

module.exports = router;
