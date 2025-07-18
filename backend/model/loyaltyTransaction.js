const mongoose = require('mongoose');

const loyaltyTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'bonus', 'adjustment'],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxLength: [500, 'Description cannot exceed 500 characters'],
  },
  source: {
    type: String,
    enum: ['order', 'signup', 'review', 'referral', 'social_share', 'birthday', 'redemption', 'bonus', 'adjustment', 'expiration'],
    required: true,
  },
  rewardType: {
    type: String,
    enum: ['discount', 'free_shipping', 'product_discount', 'cashback'],
  },
  rewardValue: {
    type: Number,
    min: [0, 'Reward value cannot be negative'],
  },
  expiryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'expired'],
    default: 'completed',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Indexes for performance
loyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });
loyaltyTransactionSchema.index({ type: 1 });
loyaltyTransactionSchema.index({ source: 1 });
loyaltyTransactionSchema.index({ orderId: 1 });
loyaltyTransactionSchema.index({ expiryDate: 1 });
loyaltyTransactionSchema.index({ status: 1 });

// Virtual for absolute points value
loyaltyTransactionSchema.virtual('absolutePoints').get(function() {
  return Math.abs(this.points);
});

// Virtual for transaction age
loyaltyTransactionSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Pre-save middleware to set expiry date for earned points
loyaltyTransactionSchema.pre('save', function(next) {
  if (this.type === 'earned' && !this.expiryDate) {
    // Points expire after 2 years
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 2);
    this.expiryDate = expiry;
  }
  next();
});

// Method to check if transaction is expired
loyaltyTransactionSchema.methods.isExpired = function() {
  return this.expiryDate && new Date() > this.expiryDate;
};

// Static method to find expiring points
loyaltyTransactionSchema.statics.findExpiringPoints = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return this.find({
    type: 'earned',
    expiryDate: { $lte: cutoffDate, $gte: new Date() },
    status: 'completed',
  });
};

// Static method to expire old points
loyaltyTransactionSchema.statics.expireOldPoints = function() {
  return this.updateMany(
    {
      type: 'earned',
      expiryDate: { $lt: new Date() },
      status: 'completed',
    },
    {
      status: 'expired',
    }
  );
};

// Static method to get user transaction summary
loyaltyTransactionSchema.statics.getUserSummary = function(userId, startDate, endDate) {
  const matchQuery = { userId };
  
  if (startDate || endDate) {
    matchQuery.createdAt = {};
    if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$type',
        totalPoints: { $sum: '$points' },
        transactionCount: { $sum: 1 },
        avgPoints: { $avg: '$points' },
      },
    },
  ]);
};

// Static method to get points summary by source
loyaltyTransactionSchema.statics.getPointsBySource = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'earned' } },
    {
      $group: {
        _id: '$source',
        totalPoints: { $sum: '$points' },
        transactionCount: { $sum: 1 },
        lastEarned: { $max: '$createdAt' },
      },
    },
    { $sort: { totalPoints: -1 } },
  ]);
};

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
