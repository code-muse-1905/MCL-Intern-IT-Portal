const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/reports', isAuthenticated, isAdmin, reportController.getReports);
router.get('/reports/assets', isAuthenticated, isAdmin, reportController.getAssetReport);
router.get('/reports/users', isAuthenticated, isAdmin, reportController.getUserReport);
router.get('/reports/tickets', isAuthenticated, isAdmin, reportController.getTicketReport);

module.exports = router;