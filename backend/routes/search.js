const express = require('express');
const router = express.Router();
const { 
  searchProducts, 
  getSearchSuggestions, 
  getTrendingSearches, 
  indexProducts 
} = require('../controller/search');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { rateLimiters } = require('../middleware/security');

// Apply search rate limiting
router.use(rateLimiters.search);

// Public search routes
router.get('/products', searchProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/trending', getTrendingSearches);

// Admin-only routes
router.post('/index-products', isAuthenticated, isAdmin, indexProducts);

module.exports = router;
