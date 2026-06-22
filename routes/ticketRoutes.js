const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { isAuthenticated, isITStaff } = require('../middleware/authMiddleware');
const { ticketUpload } = require('../middleware/upload'); // ← NEW

// View my tickets
router.get('/tickets', isAuthenticated, ticketController.getTickets);

// Create ticket
router.get('/tickets/create', isAuthenticated, ticketController.getCreateTicket);
router.post('/tickets/create', isAuthenticated, ticketUpload, ticketController.postCreateTicket); // ← UPDATED

// View single ticket
router.get('/tickets/:id', isAuthenticated, ticketController.getViewTicket);

// Update ticket status
router.post('/tickets/:id/update', isAuthenticated, isITStaff, ticketController.postUpdateTicket);

// Add comment
router.post('/tickets/:id/comment', isAuthenticated, ticketController.postComment);

// Delete comment
router.post('/tickets/:id/comment/:commentId/delete', isAuthenticated, ticketController.deleteComment);

// Delete ticket
router.post('/tickets/:id/delete', isAuthenticated, isITStaff, ticketController.deleteTicket);

module.exports = router;