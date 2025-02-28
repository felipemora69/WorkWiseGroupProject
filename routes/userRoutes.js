const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../authMiddleware');

// Signup route
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', isAuthenticated, userController.getUserProfile);


module.exports = router;