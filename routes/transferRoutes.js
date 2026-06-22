const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { isAuthenticated, isITStaff } = require('../middleware/authMiddleware');

// Transfer asset
router.get('/assets/transfer/:id', isAuthenticated, isITStaff, transferController.getTransfer);
router.post('/assets/transfer/:id', isAuthenticated, isITStaff, transferController.postTransfer);

// Transfer history
router.get('/assets/transfers', isAuthenticated, transferController.getTransferHistory);

module.exports = router;