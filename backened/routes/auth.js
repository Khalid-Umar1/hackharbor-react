const express = require('express');
const router = express. Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// Public routes
router. post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/me', auth, authController.getMe);
router.patch('/update-profile', auth, authController.updateProfile);
router. post('/change-password', auth, authController.changePassword);
router.get('/stats', auth, authController.getUserStats);

module.exports = router;