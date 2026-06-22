const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// View profile
router.get('/profile', isAuthenticated, profileController.getProfile);

// Update profile
router.post('/profile', isAuthenticated, profileController.postProfile);

// Change password
router.post('/profile/password', isAuthenticated, profileController.changePassword);

module.exports = router;