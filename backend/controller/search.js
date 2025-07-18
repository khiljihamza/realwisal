const Product = require('../model/product');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { Client } = require('@elastic/elasticsearch');

// Initialize Elasticsearch client (optional - fallback to MongoDB if not available)
let esClient = null;
try {
  esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
  });
} catch (error) {
  console.warn('Elasticsearch not available, using MongoDB search fallback');
}

// Fuzzy search implementation
const calculateLevenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
};

const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = calculateLevenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

// Advanced product search
const searchProducts = catchAsyncErrors(async (req, res, next) => {
  const {
    query = '',
    category,
    minPrice,
    maxPrice,
    rating,
    brand,
    location,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    let products;
    let totalCount;

    if (esClient && query) {
      // Use Elasticsearch for advanced search
      const searchBody = {
        query: {
          bool: {
            must: [
              query ? {
                multi_match: {
                  query,
                  fields: ['name^3', 'description^2', 'tags', 'category'],
                  fuzziness: 'AUTO',
                  prefix_length: 1,
                  max_expansions: 10,
                },
              } : { match_all: {} },
            ],
            filter: [],
          },
        },
        highlight: {
          fields: {
            name: {},
            description: {},
          },
        },
        size: limitNumber,
        from: skip,
      };

      // Add filters
      if (category) {
        searchBody.query.bool.filter.push({ term: { category: category.toLowerCase() } });
      }

      if (minPrice || maxPrice) {
        const priceRange = {};
        if (minPrice) priceRange.gte = parseFloat(minPrice);
        if (maxPrice) priceRange.lte = parseFloat(maxPrice);
        searchBody.query.bool.filter.push({ range: { discountPrice: priceRange } });
      }

      if (rating) {
        searchBody.query.bool.filter.push({ range: { ratings: { gte: parseFloat(rating) } } });
      }

      // Add sorting
      if (sortBy === 'price_asc') {
        searchBody.sort = [{ discountPrice: { order: 'asc' } }];
      } else if (sortBy === 'price_desc') {
        searchBody.sort = [{ discountPrice: { order: 'desc' } }];
      } else if (sortBy === 'rating') {
        searchBody.sort = [{ ratings: { order: 'desc' } }];
      } else if (sortBy === 'newest') {
        searchBody.sort = [{ createdAt: { order: 'desc' } }];
      }

      const response = await esClient.search({
        index: 'products',
        body: searchBody,
      });

      products = response.body.hits.hits.map(hit => ({
        ...hit._source,
        _id: hit._id,
        _score: hit._score,
        highlights: hit.highlight,
      }));

      totalCount = response.body.hits.total.value;
    } else {
      // Fallback to MongoDB search
      const matchQuery = {};
      const filters = {};

      // Build search query
      if (query) {
        matchQuery.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ];
      }

      // Add filters
      if (category) filters.category = { $regex: category, $options: 'i' };
      if (minPrice || maxPrice) {
        filters.discountPrice = {};
        if (minPrice) filters.discountPrice.$gte = parseFloat(minPrice);
        if (maxPrice) filters.discountPrice.$lte = parseFloat(maxPrice);
      }
      if (rating) filters.ratings = { $gte: parseFloat(rating) };

      const finalQuery = { ...matchQuery, ...filters };

      // Build sort query
      let sortQuery = {};
      if (sortBy === 'price_asc') sortQuery = { discountPrice: 1 };
      else if (sortBy === 'price_desc') sortQuery = { discountPrice: -1 };
      else if (sortBy === 'rating') sortQuery = { ratings: -1 };
      else if (sortBy === 'newest') sortQuery = { createdAt: -1 };

      // Execute query
      products = await Product.find(finalQuery)
        .populate('shop', 'name avatar')
        .sort(sortQuery)
        .limit(limitNumber)
        .skip(skip);

      totalCount = await Product.countDocuments(finalQuery);

      // Apply fuzzy search scoring if query exists
      if (query && products.length > 0) {
        products = products.map(product => {
          const nameScore = calculateSimilarity(query.toLowerCase(), product.name.toLowerCase());
          const descScore = calculateSimilarity(query.toLowerCase(), product.description.toLowerCase());
          const categoryScore = calculateSimilarity(query.toLowerCase(), product.category.toLowerCase());
          
          return {
            ...product.toObject(),
            _score: Math.max(nameScore * 3, descScore * 2, categoryScore),
          };
        }).sort((a, b) => b._score - a._score);
      }
    }

    const totalPages = Math.ceil(totalCount / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNumber,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      },
      query: {
        searchTerm: query,
        filters: { category, minPrice, maxPrice, rating, brand, location },
        sortBy,
      },
    });
  } catch (error) {
    return next(new ErrorHandler('Search failed', 500));
  }
});

// Get search suggestions
const getSearchSuggestions = catchAsyncErrors(async (req, res, next) => {
  const { q: query } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Query must be at least 2 characters long',
    });
  }

  try {
    const suggestions = [];

    // Get product name suggestions
    const productSuggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { tags: { $regex: query, $options: 'i' } },
          ],
        },
      },
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
        },
      },
      { $limit: 5 },
      { $sort: { count: -1 } },
    ]);

    productSuggestions.forEach(item => {
      suggestions.push({
        text: item._id,
        type: 'product',
        count: item.count,
      });
    });

    // Get category suggestions
    const categorySuggestions = await Product.aggregate([
      {
        $match: {
          category: { $regex: query, $options: 'i' },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $limit: 3 },
      { $sort: { count: -1 } },
    ]);

    categorySuggestions.forEach(item => {
      suggestions.push({
        text: item._id,
        type: 'category',
        count: item.count,
      });
    });

    // Get brand suggestions (from shop names)
    const brandSuggestions = await Product.aggregate([
      {
        $lookup: {
          from: 'shops',
          localField: 'shopId',
          foreignField: '_id',
          as: 'shop',
        },
      },
      { $unwind: '$shop' },
      {
        $match: {
          'shop.name': { $regex: query, $options: 'i' },
        },
      },
      {
        $group: {
          _id: '$shop.name',
          count: { $sum: 1 },
        },
      },
      { $limit: 3 },
      { $sort: { count: -1 } },
    ]);

    brandSuggestions.forEach(item => {
      suggestions.push({
        text: item._id,
        type: 'brand',
        count: item.count,
      });
    });

    res.status(200).json({
      success: true,
      data: suggestions.slice(0, 10), // Limit total suggestions
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to get suggestions', 500));
  }
});

// Get trending searches
const getTrendingSearches = catchAsyncErrors(async (req, res, next) => {
  try {
    // This would typically come from a search analytics service
    // For now, we'll return popular categories and products
    const trendingCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$ratings' },
        },
      },
      { $match: { avgRating: { $gte: 3.5 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const trendingProducts = await Product.find()
      .sort({ sold_out: -1, ratings: -1 })
      .limit(10)
      .select('name category ratings sold_out');

    res.status(200).json({
      success: true,
      data: {
        categories: trendingCategories.map(cat => ({
          text: cat._id,
          type: 'category',
          count: cat.count,
          avgRating: cat.avgRating,
        })),
        products: trendingProducts.map(product => ({
          text: product.name,
          type: 'product',
          category: product.category,
          rating: product.ratings,
          sales: product.sold_out,
        })),
      },
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to get trending searches', 500));
  }
});

// Index products in Elasticsearch (admin only)
const indexProducts = catchAsyncErrors(async (req, res, next) => {
  if (!esClient) {
    return next(new ErrorHandler('Elasticsearch not configured', 500));
  }

  try {
    const products = await Product.find().populate('shop', 'name');
    
    const body = products.flatMap(product => [
      { index: { _index: 'products', _id: product._id.toString() } },
      {
        name: product.name,
        description: product.description,
        category: product.category.toLowerCase(),
        tags: product.tags,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        ratings: product.ratings,
        stock: product.stock,
        shopName: product.shop.name,
        createdAt: product.createdAt,
      },
    ]);

    const response = await esClient.bulk({ refresh: true, body });

    res.status(200).json({
      success: true,
      message: `Indexed ${products.length} products`,
      errors: response.body.errors,
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to index products', 500));
  }
});

module.exports = {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches,
  indexProducts,
};
