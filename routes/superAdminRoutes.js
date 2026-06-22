const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { isAuthenticated, isSuperAdmin } = require('../middleware/authMiddleware');

// Super Admin Dashboard
router.get('/superadmin', isAuthenticated, isSuperAdmin, superAdminController.getDashboard);

// Department Management
router.get('/superadmin/departments', isAuthenticated, isSuperAdmin, superAdminController.getDepartments);
router.post('/superadmin/departments/add', isAuthenticated, isSuperAdmin, superAdminController.postAddDepartment);
router.get('/superadmin/departments/:id', isAuthenticated, isSuperAdmin, superAdminController.getDepartmentView);
router.get('/superadmin/departments/:id/edit', isAuthenticated, isSuperAdmin, superAdminController.getDepartmentEdit);
router.post('/superadmin/departments/:id/edit', isAuthenticated, isSuperAdmin, superAdminController.postDepartmentEdit);
router.post('/superadmin/departments/delete/:id', isAuthenticated, isSuperAdmin, superAdminController.deleteDepartment);

// User Management
router.get('/superadmin/users', isAuthenticated, isSuperAdmin, superAdminController.getUsers);
router.post('/superadmin/users/add', isAuthenticated, isSuperAdmin, superAdminController.postAddUser);
router.post('/superadmin/users/:id/toggle', isAuthenticated, isSuperAdmin, superAdminController.toggleUser);
router.post('/superadmin/users/:id/role', isAuthenticated, isSuperAdmin, superAdminController.changeRole);
router.post('/superadmin/users/:id/delete', isAuthenticated, isSuperAdmin, superAdminController.deleteUser);

// ─── HELPDESK ─────────────────────────────────────
router.get('/superadmin/helpdesk', isAuthenticated, isSuperAdmin, superAdminController.getHelpdesk);
router.post('/superadmin/helpdesk/:id/status', isAuthenticated, isSuperAdmin, superAdminController.postUpdateHelpdeskStatus);

module.exports = router;