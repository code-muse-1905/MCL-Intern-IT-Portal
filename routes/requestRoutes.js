const express = require('express');
const router = express.Router();
const assetRequestController = require('../controllers/assetRequestController');
const { isAuthenticated, isDeptAdmin } = require('../middleware/authMiddleware');

// Employee — Create request
router.get('/requests/create', isAuthenticated, assetRequestController.getCreateRequest);
router.post('/requests/create', isAuthenticated, assetRequestController.postCreateRequest);

// Employee — View my requests
router.get('/requests', isAuthenticated, assetRequestController.getMyRequests);

// Dept Admin — Pending requests panel
router.get('/requests/pending', isAuthenticated, isDeptAdmin, assetRequestController.getPendingRequests);
router.post('/requests/:id/update', isAuthenticated, isDeptAdmin, assetRequestController.postUpdateRequest);

module.exports = router;