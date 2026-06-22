const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// View all users - only admin
router.get('/admin/users', isAuthenticated, isAdmin, adminController.getUsers);

// Activate/deactivate user - only admin
router.post('/admin/users/:id/toggle', isAuthenticated, isAdmin, adminController.toggleUser);

// Change user role - only admin
router.post('/admin/users/:id/role', isAuthenticated, isAdmin, adminController.changeRole);

// Delete user - only admin
router.post('/admin/users/:id/delete', isAuthenticated, isAdmin, adminController.deleteUser);

module.exports = router;