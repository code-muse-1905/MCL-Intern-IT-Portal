const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { isAuthenticated, isITStaff } = require('../middleware/authMiddleware');

// View and add maintenance records
router.get('/assets/maintenance/:id', isAuthenticated, maintenanceController.getMaintenance);
router.post('/assets/maintenance/:id', isAuthenticated, isITStaff, maintenanceController.postMaintenance);

// Delete maintenance record
router.post('/assets/maintenance/:assetId/delete/:recordId', isAuthenticated, isITStaff, maintenanceController.deleteMaintenance);

module.exports = router;