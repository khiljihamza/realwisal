const express = require('express');
const router = express.Router();
const {
  initializePayment,
  confirmPayment,
  refundPayment,
  getPaymentMethods,
  getPaymentStatus
} = require('../controller/paymentGateway');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { rateLimiters } = require('../middleware/security');

// Apply payment rate limiting
router.use('/initialize', rateLimiters.payment);
router.use('/confirm', rateLimiters.payment);

// Public routes
router.get('/methods', getPaymentMethods);

// Authenticated routes
router.post('/initialize', isAuthenticated, initializePayment);
router.post('/confirm', isAuthenticated, confirmPayment);
router.get('/status/:orderId', isAuthenticated, getPaymentStatus);

// Admin routes
router.post('/refund', isAuthenticated, isAdmin, refundPayment);

module.exports = router;
