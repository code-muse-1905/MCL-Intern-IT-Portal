const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// View all documents
router.get('/documents', isAuthenticated, documentController.getDocuments);

// Upload document
router.get('/documents/upload', isAuthenticated, documentController.getUpload);
router.post('/documents/upload', isAuthenticated, documentController.upload.single('file'), documentController.postUpload);

// Approve / Reject — admin and superadmin only
router.post('/documents/:id/approve', isAuthenticated, isAdmin, documentController.approveDocument);
router.post('/documents/:id/reject', isAuthenticated, isAdmin, documentController.rejectDocument);

// Delete
router.post('/documents/delete/:id', isAuthenticated, isAdmin, documentController.deleteDocument);

module.exports = router;