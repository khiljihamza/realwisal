const LoyaltyProgram = require('../model/loyaltyProgram');
const User = require('../model/user');
const Order = require('../model/order');
const LoyaltyTransaction = require('../model/loyaltyTransaction');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendMail = require('../utils/sendMail');

// Points configuration
const POINTS_CONFIG = {
  SIGNUP_BONUS: 100,
  ORDER_PERCENTAGE: 1, // 1% of order value in points
  REVIEW_BONUS: 50,
  REFERRAL_BONUS: 200,
  SOCIAL_SHARE_BONUS: 25,
  BIRTHDAY_BONUS: 500,
};

// Tier thresholds (points required)
const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 15000,
  DIAMOND: 50000,
};

// Tier benefits (discount percentages)
const TIER_BENEFITS = {
  BRONZE: { discount: 0, earningMultiplier: 1 },
  SILVER: { discount: 5, earningMultiplier: 1.2 },
  GOLD: { discount: 10, earningMultiplier: 1.5 },
  PLATINUM: { discount: 15, earningMultiplier: 2 },
  DIAMOND: { discount: 20, earningMultiplier: 2.5 },
};

// Get user loyalty profile
const getUserLoyaltyProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;
  
  let loyaltyProfile = await LoyaltyProgram.findOne({ userId })
    .populate('userId', 'name email createdAt');

  if (!loyaltyProfile) {
    // Create loyalty profile for new user
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    loyaltyProfile = await LoyaltyProgram.create({
      userId,
      totalPoints: POINTS_CONFIG.SIGNUP_BONUS,
      availablePoints: POINTS_CONFIG.SIGNUP_BONUS,
      tier: 'BRONZE',
      joinDate: new Date(),
    });

    // Record signup bonus transaction
    await LoyaltyTransaction.create({
      userId,
      type: 'earned',
      points: POINTS_CONFIG.SIGNUP_BONUS,
      description: 'Welcome bonus for joining loyalty program',
      source: 'signup',
    });

    await loyaltyProfile.populate('userId', 'name email createdAt');
  }

  // Calculate tier progress
  const currentTierIndex = Object.keys(TIER_THRESHOLDS).indexOf(loyaltyProfile.tier);
  const nextTier = Object.keys(TIER_THRESHOLDS)[currentTierIndex + 1];
  const nextTierThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;
  const progressToNextTier = nextTierThreshold 
    ? ((loyaltyProfile.totalPoints - TIER_THRESHOLDS[loyaltyProfile.tier]) / 
       (nextTierThreshold - TIER_THRESHOLDS[loyaltyProfile.tier])) * 100
    : 100;

  res.status(200).json({
    success: true,
    data: {
      ...loyaltyProfile.toObject(),
      tierBenefits: TIER_BENEFITS[loyaltyProfile.tier],
      nextTier,
      nextTierThreshold,
      progressToNextTier: Math.min(progressToNextTier, 100),
      pointsToNextTier: nextTierThreshold ? Math.max(0, nextTierThreshold - loyaltyProfile.totalPoints) : 0,
    },
  });
});

// Award points for order
const awardPointsForOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.body;
  
  const order = await Order.findById(orderId).populate('user');
  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if points already awarded for this order
  const existingTransaction = await LoyaltyTransaction.findOne({
    userId: order.user._id,
    orderId,
    type: 'earned',
  });

  if (existingTransaction) {
    return next(new ErrorHandler('Points already awarded for this order', 400));
  }

  let loyaltyProfile = await LoyaltyProgram.findOne({ userId: order.user._id });
  if (!loyaltyProfile) {
    loyaltyProfile = await LoyaltyProgram.create({
      userId: order.user._id,
      totalPoints: 0,
      availablePoints: 0,
      tier: 'BRONZE',
      joinDate: new Date(),
    });
  }

  // Calculate points based on order value and tier multiplier
  const basePoints = Math.floor(order.totalPrice * POINTS_CONFIG.ORDER_PERCENTAGE);
  const tierMultiplier = TIER_BENEFITS[loyaltyProfile.tier].earningMultiplier;
  const pointsEarned = Math.floor(basePoints * tierMultiplier);

  // Update loyalty profile
  loyaltyProfile.totalPoints += pointsEarned;
  loyaltyProfile.availablePoints += pointsEarned;
  loyaltyProfile.totalSpent += order.totalPrice;
  loyaltyProfile.totalOrders += 1;

  // Check for tier upgrade
  const newTier = calculateTier(loyaltyProfile.totalPoints);
  const tierUpgraded = newTier !== loyaltyProfile.tier;
  loyaltyProfile.tier = newTier;

  await loyaltyProfile.save();

  // Record transaction
  await LoyaltyTransaction.create({
    userId: order.user._id,
    orderId,
    type: 'earned',
    points: pointsEarned,
    description: `Points earned from order #${order._id}`,
    source: 'order',
  });

  // Send tier upgrade notification
  if (tierUpgraded) {
    try {
      await sendMail({
        email: order.user.email,
        subject: `Congratulations! You've been upgraded to ${newTier} tier`,
        html: `
          <h2>🎉 Tier Upgrade!</h2>
          <p>Congratulations! You've been upgraded to <strong>${newTier}</strong> tier in our loyalty program.</p>
          <p><strong>Your new benefits:</strong></p>
          <ul>
            <li>${TIER_BENEFITS[newTier].discount}% discount on all orders</li>
            <li>${TIER_BENEFITS[newTier].earningMultiplier}x points earning multiplier</li>
          </ul>
          <p>Keep shopping to unlock even more rewards!</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send tier upgrade email:', error);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      pointsEarned,
      tierUpgraded,
      newTier: loyaltyProfile.tier,
      totalPoints: loyaltyProfile.totalPoints,
      availablePoints: loyaltyProfile.availablePoints,
    },
  });
});

// Redeem points
const redeemPoints = catchAsyncErrors(async (req, res, next) => {
  const { points, rewardType, rewardId } = req.body;
  const userId = req.user.id;

  if (!points || points <= 0) {
    return next(new ErrorHandler('Invalid points amount', 400));
  }

  const loyaltyProfile = await LoyaltyProgram.findOne({ userId });
  if (!loyaltyProfile) {
    return next(new ErrorHandler('Loyalty profile not found', 404));
  }

  if (loyaltyProfile.availablePoints < points) {
    return next(new ErrorHandler('Insufficient points', 400));
  }

  // Validate reward type and calculate discount/reward
  let rewardValue = 0;
  let description = '';

  switch (rewardType) {
    case 'discount':
      // 100 points = $1 discount
      rewardValue = points / 100;
      description = `$${rewardValue} discount voucher`;
      break;
    case 'free_shipping':
      if (points < 500) {
        return next(new ErrorHandler('Free shipping requires 500 points', 400));
      }
      rewardValue = 10; // $10 shipping value
      description = 'Free shipping voucher';
      break;
    case 'product_discount':
      // Product-specific discount
      rewardValue = points / 50; // 50 points = $1 product discount
      description = `$${rewardValue} product discount`;
      break;
    default:
      return next(new ErrorHandler('Invalid reward type', 400));
  }

  // Deduct points
  loyaltyProfile.availablePoints -= points;
  loyaltyProfile.totalRedeemed += points;
  await loyaltyProfile.save();

  // Record transaction
  await LoyaltyTransaction.create({
    userId,
    type: 'redeemed',
    points: -points,
    description: `Redeemed ${points} points for ${description}`,
    source: 'redemption',
    rewardType,
    rewardValue,
  });

  // Generate voucher code
  const voucherCode = `LOYALTY${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

  res.status(200).json({
    success: true,
    data: {
      pointsRedeemed: points,
      rewardValue,
      description,
      voucherCode,
      availablePoints: loyaltyProfile.availablePoints,
    },
  });
});

// Get loyalty transactions
const getLoyaltyTransactions = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;
  const { page = 1, limit = 20, type } = req.query;

  const query = { userId };
  if (type) {
    query.type = type;
  }

  const transactions = await LoyaltyTransaction.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('orderId', 'totalPrice createdAt');

  const totalCount = await LoyaltyTransaction.countDocuments(query);

  res.status(200).json({
    success: true,
    data: transactions,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  });
});

// Award points for actions (review, referral, etc.)
const awardActionPoints = catchAsyncErrors(async (req, res, next) => {
  const { action, userId, metadata = {} } = req.body;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  let pointsToAward = 0;
  let description = '';

  switch (action) {
    case 'review':
      // Check if review points already awarded
      const existingReviewTransaction = await LoyaltyTransaction.findOne({
        userId,
        source: 'review',
        'metadata.productId': metadata.productId,
      });
      
      if (existingReviewTransaction) {
        return next(new ErrorHandler('Review points already awarded', 400));
      }
      
      pointsToAward = POINTS_CONFIG.REVIEW_BONUS;
      description = 'Points for writing a product review';
      break;

    case 'referral':
      pointsToAward = POINTS_CONFIG.REFERRAL_BONUS;
      description = `Referral bonus for inviting ${metadata.referredEmail}`;
      break;

    case 'social_share':
      pointsToAward = POINTS_CONFIG.SOCIAL_SHARE_BONUS;
      description = `Points for sharing on ${metadata.platform}`;
      break;

    case 'birthday':
      // Check if birthday points already awarded this year
      const currentYear = new Date().getFullYear();
      const existingBirthdayTransaction = await LoyaltyTransaction.findOne({
        userId,
        source: 'birthday',
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1),
        },
      });

      if (existingBirthdayTransaction) {
        return next(new ErrorHandler('Birthday points already awarded this year', 400));
      }

      pointsToAward = POINTS_CONFIG.BIRTHDAY_BONUS;
      description = 'Happy Birthday bonus points!';
      break;

    default:
      return next(new ErrorHandler('Invalid action type', 400));
  }

  let loyaltyProfile = await LoyaltyProgram.findOne({ userId });
  if (!loyaltyProfile) {
    loyaltyProfile = await LoyaltyProgram.create({
      userId,
      totalPoints: 0,
      availablePoints: 0,
      tier: 'BRONZE',
      joinDate: new Date(),
    });
  }

  // Update points
  loyaltyProfile.totalPoints += pointsToAward;
  loyaltyProfile.availablePoints += pointsToAward;

  // Check for tier upgrade
  const newTier = calculateTier(loyaltyProfile.totalPoints);
  const tierUpgraded = newTier !== loyaltyProfile.tier;
  loyaltyProfile.tier = newTier;

  await loyaltyProfile.save();

  // Record transaction
  await LoyaltyTransaction.create({
    userId,
    type: 'earned',
    points: pointsToAward,
    description,
    source: action,
    metadata,
  });

  res.status(200).json({
    success: true,
    data: {
      pointsEarned: pointsToAward,
      tierUpgraded,
      newTier: loyaltyProfile.tier,
      totalPoints: loyaltyProfile.totalPoints,
      availablePoints: loyaltyProfile.availablePoints,
    },
  });
});

// Get loyalty program statistics (admin)
const getLoyaltyStatistics = catchAsyncErrors(async (req, res, next) => {
  const stats = await LoyaltyProgram.aggregate([
    {
      $group: {
        _id: '$tier',
        count: { $sum: 1 },
        totalPoints: { $sum: '$totalPoints' },
        totalSpent: { $sum: '$totalSpent' },
        avgPoints: { $avg: '$totalPoints' },
        avgSpent: { $avg: '$totalSpent' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const totalMembers = await LoyaltyProgram.countDocuments();
  const totalPointsIssued = await LoyaltyProgram.aggregate([
    { $group: { _id: null, total: { $sum: '$totalPoints' } } },
  ]);

  const totalPointsRedeemed = await LoyaltyProgram.aggregate([
    { $group: { _id: null, total: { $sum: '$totalRedeemed' } } },
  ]);

  const recentTransactions = await LoyaltyTransaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId', 'name email');

  res.status(200).json({
    success: true,
    data: {
      tierDistribution: stats,
      totalMembers,
      totalPointsIssued: totalPointsIssued[0]?.total || 0,
      totalPointsRedeemed: totalPointsRedeemed[0]?.total || 0,
      pointsOutstanding: (totalPointsIssued[0]?.total || 0) - (totalPointsRedeemed[0]?.total || 0),
      recentTransactions,
    },
  });
});

// Helper function to calculate tier based on points
const calculateTier = (totalPoints) => {
  const tiers = Object.keys(TIER_THRESHOLDS);
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalPoints >= TIER_THRESHOLDS[tiers[i]]) {
      return tiers[i];
    }
  }
  return 'BRONZE';
};

module.exports = {
  getUserLoyaltyProfile,
  awardPointsForOrder,
  redeemPoints,
  getLoyaltyTransactions,
  awardActionPoints,
  getLoyaltyStatistics,
  POINTS_CONFIG,
  TIER_THRESHOLDS,
  TIER_BENEFITS,
};
