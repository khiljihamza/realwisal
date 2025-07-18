const mongoose = require('mongoose');

const flashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Flash sale name is required'],
    trim: true,
    maxLength: [100, 'Flash sale name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Flash sale description is required'],
    maxLength: [500, 'Description cannot exceed 500 characters'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [90, 'Discount cannot exceed 90%'],
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    flashPrice: {
      type: Number,
      required: [true, 'Flash price is required'],
      min: [0, 'Flash price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, 'Sold quantity cannot be negative'],
    },
  }],
  maxQuantityPerUser: {
    type: Number,
    required: [true, 'Max quantity per user is required'],
    min: [1, 'Max quantity per user must be at least 1'],
    max: [50, 'Max quantity per user cannot exceed 50'],
  },
  totalQuantityLimit: {
    type: Number,
    required: [true, 'Total quantity limit is required'],
    min: [1, 'Total quantity limit must be at least 1'],
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'expired', 'cancelled'],
    default: 'scheduled',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Indexes for performance
flashSaleSchema.index({ startDate: 1, endDate: 1 });
flashSaleSchema.index({ status: 1 });
flashSaleSchema.index({ 'products.productId': 1 });

// Virtual for duration
flashSaleSchema.virtual('duration').get(function() {
  return this.endDate - this.startDate;
});

// Virtual for time remaining
flashSaleSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  if (this.status === 'active') {
    return Math.max(0, this.endDate - now);
  }
  if (this.status === 'scheduled') {
    return this.startDate - now;
  }
  return 0;
});

// Virtual for total revenue
flashSaleSchema.virtual('totalRevenue').get(function() {
  return this.products.reduce((sum, product) => {
    return sum + (product.flashPrice * product.sold);
  }, 0);
});

// Pre-save middleware to validate dates
flashSaleSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  
  // Validate total quantity doesn't exceed limit
  const totalQuantity = this.products.reduce((sum, product) => sum + product.quantity, 0);
  if (totalQuantity > this.totalQuantityLimit) {
    next(new Error('Total product quantity exceeds limit'));
  }
  
  next();
});

// Method to check if flash sale is active
flashSaleSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
};

// Method to check if product is available
flashSaleSchema.methods.isProductAvailable = function(productId, quantity = 1) {
  const product = this.products.find(p => p.productId.toString() === productId.toString());
  if (!product) return false;
  
  return (product.sold + quantity) <= product.quantity;
};

// Method to get product flash price
flashSaleSchema.methods.getProductFlashPrice = function(productId) {
  const product = this.products.find(p => p.productId.toString() === productId.toString());
  return product ? product.flashPrice : null;
};

// Static method to find active flash sales for product
flashSaleSchema.statics.findActiveForProduct = function(productId) {
  const now = new Date();
  return this.find({
    'products.productId': productId,
    startDate: { $lte: now },
    endDate: { $gte: now },
    status: 'active',
  });
};

// Static method to get upcoming flash sales
flashSaleSchema.statics.getUpcoming = function(limit = 10) {
  const now = new Date();
  return this.find({
    startDate: { $gt: now },
    status: 'scheduled',
  })
    .sort({ startDate: 1 })
    .limit(limit)
    .populate('products.productId', 'name images originalPrice');
};

module.exports = mongoose.model('FlashSale', flashSaleSchema);
