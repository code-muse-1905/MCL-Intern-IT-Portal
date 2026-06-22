const express = require('express');
const router = express.Router();
const deptController = require('../controllers/deptController');
const { isAuthenticated, isDeptAdmin } = require('../middleware/authMiddleware');

// Dept users
router.get('/dept/users', isAuthenticated, isDeptAdmin, deptController.getDeptUsers);

// Dept assets
router.get('/dept/assets', isAuthenticated, isDeptAdmin, deptController.getDeptAssets);

// Dept tickets
router.get('/dept/tickets', isAuthenticated, isDeptAdmin, deptController.getDeptTickets);

// Dept reports
router.get('/dept/reports', isAuthenticated, isDeptAdmin, deptController.getDeptReports);

// ─── HELPDESK ─────────────────────────────────────
router.get('/dept/helpdesk', isAuthenticated, isDeptAdmin, deptController.getHelpdesk);
router.post('/dept/helpdesk/:id/approve', isAuthenticated, isDeptAdmin, deptController.postHelpdeskApprove);
router.post('/dept/helpdesk/:id/reject', isAuthenticated, isDeptAdmin, deptController.postHelpdeskReject);

module.exports = router;