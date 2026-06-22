const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const allocationController = require('../controllers/allocationController');
const { isAuthenticated, isITStaff } = require('../middleware/authMiddleware');

// View all assets
router.get('/assets', isAuthenticated, assetController.getAssets);

// Asset detail page
router.get('/assets/:id', isAuthenticated, allocationController.getAssetDetail);

// Add asset
router.get('/assets/add/new', isAuthenticated, isITStaff, assetController.getAddAsset);
router.post('/assets/add/new', isAuthenticated, isITStaff, assetController.postAddAsset);

// Edit asset
router.get('/assets/edit/:id', isAuthenticated, isITStaff, assetController.getEditAsset);
router.post('/assets/edit/:id', isAuthenticated, isITStaff, assetController.postEditAsset);

// Delete asset
router.post('/assets/delete/:id', isAuthenticated, isITStaff, assetController.deleteAsset);

// Allocate asset
router.get('/assets/:id/allocate', isAuthenticated, isITStaff, allocationController.getAllocate);
router.post('/assets/:id/allocate', isAuthenticated, isITStaff, allocationController.postAllocate);

module.exports = router;