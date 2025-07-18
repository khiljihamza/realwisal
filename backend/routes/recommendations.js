const express = require('express');
const router = express.Router();
const {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getCategoryBasedRecommendations,
  retrainRecommendationSystem
} = require('../controller/recommendations');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Public recommendation routes
router.get('/trending', getTrendingProducts);
router.get('/category/:category', getCategoryBasedRecommendations);
router.get('/similar/:productId', getSimilarProducts);

// User-specific routes (require authentication)
router.get('/personalized/:userId', isAuthenticated, getPersonalizedRecommendations);

// Admin routes
router.post('/retrain', isAuthenticated, isAdmin, retrainRecommendationSystem);

module.exports = router;
