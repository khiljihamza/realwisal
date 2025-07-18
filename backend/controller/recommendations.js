const Product = require('../model/product');
const Order = require('../model/order');
const User = require('../model/user');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Collaborative Filtering Algorithm
class CollaborativeFiltering {
  constructor() {
    this.userItemMatrix = new Map();
    this.itemSimilarity = new Map();
    this.userSimilarity = new Map();
  }

  // Build user-item interaction matrix
  async buildUserItemMatrix() {
    const orders = await Order.find({ status: 'Delivered' })
      .populate('user', '_id')
      .populate('cart.productId', '_id category');

    this.userItemMatrix.clear();

    orders.forEach(order => {
      const userId = order.user._id.toString();
      if (!this.userItemMatrix.has(userId)) {
        this.userItemMatrix.set(userId, new Map());
      }

      order.cart.forEach(item => {
        if (item.productId) {
          const productId = item.productId._id.toString();
          const userItems = this.userItemMatrix.get(userId);
          const currentRating = userItems.get(productId) || 0;
          userItems.set(productId, currentRating + item.qty);
        }
      });
    });
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vectorA, vectorB) {
    const commonKeys = [...vectorA.keys()].filter(key => vectorB.has(key));
    
    if (commonKeys.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key of commonKeys) {
      const a = vectorA.get(key);
      const b = vectorB.get(key);
      dotProduct += a * b;
    }

    for (const [key, value] of vectorA) {
      normA += value * value;
    }

    for (const [key, value] of vectorB) {
      normB += value * value;
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Calculate item-item similarity
  async calculateItemSimilarity() {
    this.itemSimilarity.clear();
    const products = Array.from(new Set(
      Array.from(this.userItemMatrix.values())
        .flatMap(userItems => Array.from(userItems.keys()))
    ));

    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        const productA = products[i];
        const productB = products[j];

        const usersA = new Map();
        const usersB = new Map();

        for (const [userId, userItems] of this.userItemMatrix) {
          if (userItems.has(productA)) {
            usersA.set(userId, userItems.get(productA));
          }
          if (userItems.has(productB)) {
            usersB.set(userId, userItems.get(productB));
          }
        }

        const similarity = this.cosineSimilarity(usersA, usersB);
        
        if (!this.itemSimilarity.has(productA)) {
          this.itemSimilarity.set(productA, new Map());
        }
        if (!this.itemSimilarity.has(productB)) {
          this.itemSimilarity.set(productB, new Map());
        }

        this.itemSimilarity.get(productA).set(productB, similarity);
        this.itemSimilarity.get(productB).set(productA, similarity);
      }
    }
  }

  // Get item-based recommendations for a user
  getItemBasedRecommendations(userId, limit = 10) {
    const userItems = this.userItemMatrix.get(userId);
    if (!userItems) return [];

    const recommendations = new Map();

    for (const [productId, rating] of userItems) {
      const similarItems = this.itemSimilarity.get(productId);
      if (!similarItems) continue;

      for (const [similarProductId, similarity] of similarItems) {
        if (userItems.has(similarProductId)) continue; // User already has this item

        const currentScore = recommendations.get(similarProductId) || 0;
        recommendations.set(similarProductId, currentScore + similarity * rating);
      }
    }

    return Array.from(recommendations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId, score]) => ({ productId, score }));
  }
}

// Content-Based Filtering
class ContentBasedFiltering {
  // Calculate TF-IDF similarity between products
  calculateProductSimilarity(product1, product2) {
    const features1 = this.extractFeatures(product1);
    const features2 = this.extractFeatures(product2);

    const allFeatures = new Set([...features1, ...features2]);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const feature of allFeatures) {
      const count1 = features1.filter(f => f === feature).length;
      const count2 = features2.filter(f => f === feature).length;

      dotProduct += count1 * count2;
      norm1 += count1 * count1;
      norm2 += count2 * count2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Extract features from product for content-based filtering
  extractFeatures(product) {
    const features = [];
    
    // Category
    features.push(`category:${product.category.toLowerCase()}`);
    
    // Price range
    const priceRange = this.getPriceRange(product.discountPrice || product.originalPrice);
    features.push(`price:${priceRange}`);
    
    // Rating range
    const ratingRange = Math.floor(product.ratings);
    features.push(`rating:${ratingRange}`);
    
    // Keywords from name and description
    const text = `${product.name} ${product.description}`.toLowerCase();
    const keywords = text.split(/\s+/).filter(word => word.length > 3);
    keywords.forEach(keyword => features.push(`keyword:${keyword}`));
    
    // Tags if available
    if (product.tags) {
      const tags = product.tags.toLowerCase().split(',');
      tags.forEach(tag => features.push(`tag:${tag.trim()}`));
    }

    return features;
  }

  getPriceRange(price) {
    if (price < 50) return 'low';
    if (price < 200) return 'medium';
    if (price < 500) return 'high';
    return 'premium';
  }

  async getContentBasedRecommendations(userId, limit = 10) {
    // Get user's purchase history
    const userOrders = await Order.find({ 
      user: userId, 
      status: 'Delivered' 
    }).populate('cart.productId');

    if (!userOrders.length) return [];

    const userProducts = userOrders.flatMap(order => 
      order.cart.map(item => item.productId).filter(Boolean)
    );

    if (!userProducts.length) return [];

    // Get all products for comparison
    const allProducts = await Product.find().select(
      'name description category originalPrice discountPrice ratings tags'
    );

    const recommendations = new Map();

    // Calculate similarity with user's liked products
    userProducts.forEach(userProduct => {
      allProducts.forEach(product => {
        const productId = product._id.toString();
        const userProductId = userProduct._id.toString();
        
        if (productId === userProductId) return; // Skip same product

        const similarity = this.calculateProductSimilarity(userProduct, product);
        const currentScore = recommendations.get(productId) || 0;
        recommendations.set(productId, currentScore + similarity);
      });
    });

    return Array.from(recommendations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId, score]) => ({ productId, score }));
  }
}

// Hybrid Recommendation System
class HybridRecommendationSystem {
  constructor() {
    this.collaborativeFiltering = new CollaborativeFiltering();
    this.contentBasedFiltering = new ContentBasedFiltering();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    await this.collaborativeFiltering.buildUserItemMatrix();
    await this.collaborativeFiltering.calculateItemSimilarity();
    this.isInitialized = true;
  }

  async getHybridRecommendations(userId, limit = 10) {
    await this.initialize();

    const [collaborativeRecs, contentRecs] = await Promise.all([
      this.collaborativeFiltering.getItemBasedRecommendations(userId, limit * 2),
      this.contentBasedFiltering.getContentBasedRecommendations(userId, limit * 2),
    ]);

    // Combine recommendations with weighted scoring
    const combinedRecs = new Map();

    // Collaborative filtering weight: 0.6
    collaborativeRecs.forEach(({ productId, score }) => {
      combinedRecs.set(productId, (combinedRecs.get(productId) || 0) + score * 0.6);
    });

    // Content-based filtering weight: 0.4
    contentRecs.forEach(({ productId, score }) => {
      combinedRecs.set(productId, (combinedRecs.get(productId) || 0) + score * 0.4);
    });

    return Array.from(combinedRecs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId, score]) => ({ productId, score }));
  }
}

// Initialize recommendation system
const recommendationSystem = new HybridRecommendationSystem();

// API Endpoints
const getPersonalizedRecommendations = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const { limit = 10 } = req.query;

  if (!userId) {
    return next(new ErrorHandler('User ID is required', 400));
  }

  try {
    const recommendations = await recommendationSystem.getHybridRecommendations(
      userId, 
      parseInt(limit)
    );

    const productIds = recommendations.map(rec => rec.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .populate('shop', 'name avatar');

    const recommendedProducts = recommendations
      .map(rec => {
        const product = products.find(p => p._id.toString() === rec.productId);
        return product ? {
          product,
          score: rec.score,
          reason: 'personalized',
        } : null;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: recommendedProducts,
      algorithm: 'hybrid',
      userId,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to get recommendations', 500));
  }
});

const getSimilarProducts = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { limit = 6 } = req.query;

  if (!productId) {
    return next(new ErrorHandler('Product ID is required', 400));
  }

  try {
    const targetProduct = await Product.findById(productId);
    if (!targetProduct) {
      return next(new ErrorHandler('Product not found', 404));
    }

    const allProducts = await Product.find({ 
      _id: { $ne: productId },
      category: targetProduct.category 
    }).populate('shop', 'name avatar');

    const contentFilter = new ContentBasedFiltering();
    const similarities = allProducts.map(product => ({
      product,
      similarity: contentFilter.calculateProductSimilarity(targetProduct, product),
    }));

    const similarProducts = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, parseInt(limit))
      .map(({ product, similarity }) => ({
        product,
        score: similarity,
        reason: 'similar_products',
      }));

    res.status(200).json({
      success: true,
      data: similarProducts,
      targetProduct: targetProduct.name,
      algorithm: 'content_based',
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to get similar products', 500));
  }
});

const getTrendingProducts = catchAsyncErrors(async (req, res, next) => {
  const { limit = 10, category } = req.query;

  try {
    const query = category ? { category: { $regex: category, $options: 'i' } } : {};
    
    const trendingProducts = await Product.find(query)
      .sort({ sold_out: -1, ratings: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('shop', 'name avatar');

    const recommendedProducts = trendingProducts.map(product => ({
      product,
      score: product.sold_out * 0.7 + product.ratings * 0.3,
      reason: 'trending',
    }));

    res.status(200).json({
      success: true,
      data: recommendedProducts,
      algorithm: 'trending',
      category: category || 'all',
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to get trending products', 500));
  }
});

const getCategoryBasedRecommendations = catchAsyncErrors(async (req, res, next) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;

  if (!category) {
    return next(new ErrorHandler('Category is required', 400));
  }

  try {
    const products = await Product.find({ 
      category: { $regex: category, $options: 'i' } 
    })
      .sort({ ratings: -1, sold_out: -1 })
      .limit(parseInt(limit))
      .populate('shop', 'name avatar');

    const recommendedProducts = products.map(product => ({
      product,
      score: product.ratings * 0.6 + (product.sold_out / 100) * 0.4,
      reason: 'category_based',
    }));

    res.status(200).json({
      success: true,
      data: recommendedProducts,
      algorithm: 'category_based',
      category,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to get category recommendations', 500));
  }
});

// Admin endpoint to retrain the recommendation system
const retrainRecommendationSystem = catchAsyncErrors(async (req, res, next) => {
  try {
    recommendationSystem.isInitialized = false;
    await recommendationSystem.initialize();

    res.status(200).json({
      success: true,
      message: 'Recommendation system retrained successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to retrain recommendation system', 500));
  }
});

module.exports = {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getCategoryBasedRecommendations,
  retrainRecommendationSystem,
};
