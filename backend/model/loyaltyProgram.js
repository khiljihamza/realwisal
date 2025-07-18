const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: [0, 'Total points cannot be negative'],
  },
  availablePoints: {
    type: Number,
    default: 0,
    min: [0, 'Available points cannot be negative'],
  },
  totalRedeemed: {
    type: Number,
    default: 0,
    min: [0, 'Total redeemed cannot be negative'],
  },
  tier: {
    type: String,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'],
    default: 'BRONZE',
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  lastActivityDate: {
    type: Date,
    default: Date.now,
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: [0, 'Total orders cannot be negative'],
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative'],
  },
  referralCount: {
    type: Number,
    default: 0,
    min: [0, 'Referral count cannot be negative'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
    pointsExpiration: {
      type: Boolean,
      default: true,
    },
  },
  metadata: {
    lastTierUpgrade: Date,
    birthdate: Date,
    favoriteCategories: [String],
    averageOrderValue: Number,
  },
}, {
  timestamps: true,
});

// Indexes for performance
loyaltyProgramSchema.index({ userId: 1 }, { unique: true });
loyaltyProgramSchema.index({ tier: 1 });
loyaltyProgramSchema.index({ totalPoints: -1 });
loyaltyProgramSchema.index({ lastActivityDate: -1 });

// Virtual for tier progress
loyaltyProgramSchema.virtual('tierProgress').get(function() {
  const TIER_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 15000,
    DIAMOND: 50000,
  };

  const currentTierIndex = Object.keys(TIER_THRESHOLDS).indexOf(this.tier);
  const nextTier = Object.keys(TIER_THRESHOLDS)[currentTierIndex + 1];
  
  if (!nextTier) return 100; // Max tier reached

  const currentThreshold = TIER_THRESHOLDS[this.tier];
  const nextThreshold = TIER_THRESHOLDS[nextTier];
  
  return ((this.totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
});

// Virtual for points to next tier
loyaltyProgramSchema.virtual('pointsToNextTier').get(function() {
  const TIER_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 15000,
    DIAMOND: 50000,
  };

  const currentTierIndex = Object.keys(TIER_THRESHOLDS).indexOf(this.tier);
  const nextTier = Object.keys(TIER_THRESHOLDS)[currentTierIndex + 1];
  
  if (!nextTier) return 0; // Max tier reached

  const nextThreshold = TIER_THRESHOLDS[nextTier];
  return Math.max(0, nextThreshold - this.totalPoints);
});

// Virtual for lifetime value
loyaltyProgramSchema.virtual('lifetimeValue').get(function() {
  return this.totalSpent + (this.totalRedeemed * 0.01); // Assuming 1 point = $0.01
});

// Pre-save middleware to update last activity date
loyaltyProgramSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastActivityDate')) {
    this.lastActivityDate = new Date();
  }
  next();
});

// Method to check if user can redeem points
loyaltyProgramSchema.methods.canRedeem = function(points) {
  return this.availablePoints >= points && points > 0;
};

// Method to calculate discount based on tier
loyaltyProgramSchema.methods.getTierDiscount = function() {
  const TIER_BENEFITS = {
    BRONZE: 0,
    SILVER: 5,
    GOLD: 10,
    PLATINUM: 15,
    DIAMOND: 20,
  };
  
  return TIER_BENEFITS[this.tier] || 0;
};

// Method to get earning multiplier
loyaltyProgramSchema.methods.getEarningMultiplier = function() {
  const TIER_MULTIPLIERS = {
    BRONZE: 1,
    SILVER: 1.2,
    GOLD: 1.5,
    PLATINUM: 2,
    DIAMOND: 2.5,
  };
  
  return TIER_MULTIPLIERS[this.tier] || 1;
};

// Static method to find users by tier
loyaltyProgramSchema.statics.findByTier = function(tier) {
  return this.find({ tier, isActive: true });
};

// Static method to find inactive users
loyaltyProgramSchema.statics.findInactiveUsers = function(days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    lastActivityDate: { $lt: cutoffDate },
    isActive: true,
  });
};

// Static method to get tier distribution
loyaltyProgramSchema.statics.getTierDistribution = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$tier',
        count: { $sum: 1 },
        avgPoints: { $avg: '$totalPoints' },
        avgSpent: { $avg: '$totalSpent' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);
