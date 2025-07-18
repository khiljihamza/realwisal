const FlashSale = require('../model/flashSale');
const Product = require('../model/product');
const Order = require('../model/order');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cron = require('node-cron');

// Create flash sale
const createFlashSale = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    description,
    startDate,
    endDate,
    discountPercentage,
    products,
    maxQuantityPerUser,
    totalQuantityLimit,
  } = req.body;

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start <= now) {
    return next(new ErrorHandler('Start date must be in the future', 400));
  }

  if (end <= start) {
    return next(new ErrorHandler('End date must be after start date', 400));
  }

  // Validate products exist
  const productIds = products.map(p => p.productId);
  const existingProducts = await Product.find({ _id: { $in: productIds } });
  
  if (existingProducts.length !== productIds.length) {
    return next(new ErrorHandler('Some products do not exist', 400));
  }

  // Check for overlapping flash sales with same products
  const overlappingFlashSales = await FlashSale.find({
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ],
    'products.productId': { $in: productIds },
    status: { $in: ['scheduled', 'active'] }
  });

  if (overlappingFlashSales.length > 0) {
    return next(new ErrorHandler('Some products are already in other flash sales during this period', 400));
  }

  const flashSale = await FlashSale.create({
    name,
    description,
    startDate: start,
    endDate: end,
    discountPercentage,
    products: products.map(p => ({
      productId: p.productId,
      flashPrice: p.flashPrice,
      quantity: p.quantity,
      sold: 0,
    })),
    maxQuantityPerUser,
    totalQuantityLimit,
    status: 'scheduled',
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: flashSale,
  });
});

// Get all flash sales
const getAllFlashSales = catchAsyncErrors(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (status) {
    query.status = status;
  }

  const flashSales = await FlashSale.find(query)
    .populate('products.productId', 'name images originalPrice')
    .sort({ startDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalCount = await FlashSale.countDocuments(query);

  res.status(200).json({
    success: true,
    data: flashSales,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  });
});

// Get active flash sales
const getActiveFlashSales = catchAsyncErrors(async (req, res, next) => {
  const now = new Date();
  
  const activeFlashSales = await FlashSale.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
    status: 'active',
  })
    .populate('products.productId', 'name images originalPrice discountPrice ratings')
    .sort({ endDate: 1 });

  res.status(200).json({
    success: true,
    data: activeFlashSales,
  });
});

// Get flash sale by ID
const getFlashSaleById = catchAsyncErrors(async (req, res, next) => {
  const flashSale = await FlashSale.findById(req.params.id)
    .populate('products.productId', 'name images originalPrice discountPrice ratings description')
    .populate('createdBy', 'name email');

  if (!flashSale) {
    return next(new ErrorHandler('Flash sale not found', 404));
  }

  res.status(200).json({
    success: true,
    data: flashSale,
  });
});

// Update flash sale
const updateFlashSale = catchAsyncErrors(async (req, res, next) => {
  const flashSale = await FlashSale.findById(req.params.id);

  if (!flashSale) {
    return next(new ErrorHandler('Flash sale not found', 404));
  }

  // Can't update active or expired flash sales
  if (flashSale.status !== 'scheduled') {
    return next(new ErrorHandler('Can only update scheduled flash sales', 400));
  }

  const allowedUpdates = [
    'name', 
    'description', 
    'startDate', 
    'endDate', 
    'discountPercentage',
    'maxQuantityPerUser',
    'totalQuantityLimit'
  ];

  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Validate dates if being updated
  if (updates.startDate || updates.endDate) {
    const start = new Date(updates.startDate || flashSale.startDate);
    const end = new Date(updates.endDate || flashSale.endDate);
    const now = new Date();

    if (start <= now) {
      return next(new ErrorHandler('Start date must be in the future', 400));
    }

    if (end <= start) {
      return next(new ErrorHandler('End date must be after start date', 400));
    }
  }

  const updatedFlashSale = await FlashSale.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('products.productId', 'name images originalPrice');

  res.status(200).json({
    success: true,
    data: updatedFlashSale,
  });
});

// Delete flash sale
const deleteFlashSale = catchAsyncErrors(async (req, res, next) => {
  const flashSale = await FlashSale.findById(req.params.id);

  if (!flashSale) {
    return next(new ErrorHandler('Flash sale not found', 404));
  }

  // Can't delete active flash sales
  if (flashSale.status === 'active') {
    return next(new ErrorHandler('Cannot delete active flash sales', 400));
  }

  await FlashSale.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Flash sale deleted successfully',
  });
});

// Purchase flash sale product
const purchaseFlashSaleProduct = catchAsyncErrors(async (req, res, next) => {
  const { flashSaleId, productId, quantity } = req.body;
  const userId = req.user.id;

  const flashSale = await FlashSale.findById(flashSaleId);
  
  if (!flashSale) {
    return next(new ErrorHandler('Flash sale not found', 404));
  }

  const now = new Date();
  if (now < flashSale.startDate || now > flashSale.endDate) {
    return next(new ErrorHandler('Flash sale is not active', 400));
  }

  const flashProduct = flashSale.products.find(p => p.productId.toString() === productId);
  
  if (!flashProduct) {
    return next(new ErrorHandler('Product not found in this flash sale', 404));
  }

  // Check availability
  if (flashProduct.sold + quantity > flashProduct.quantity) {
    return next(new ErrorHandler('Insufficient quantity available', 400));
  }

  // Check user purchase limit
  const userPurchases = await Order.aggregate([
    {
      $match: {
        user: req.user._id,
        'flashSaleInfo.flashSaleId': flashSale._id,
        'cart.productId': productId,
      }
    },
    {
      $unwind: '$cart'
    },
    {
      $match: {
        'cart.productId': productId
      }
    },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: '$cart.qty' }
      }
    }
  ]);

  const userTotalQuantity = userPurchases[0]?.totalQuantity || 0;
  
  if (userTotalQuantity + quantity > flashSale.maxQuantityPerUser) {
    return next(new ErrorHandler(
      `Maximum ${flashSale.maxQuantityPerUser} items per user allowed`, 
      400
    ));
  }

  // Reserve the quantity (temporary hold)
  flashProduct.sold += quantity;
  await flashSale.save();

  res.status(200).json({
    success: true,
    message: 'Product reserved for purchase',
    data: {
      flashSaleId,
      productId,
      quantity,
      flashPrice: flashProduct.flashPrice,
      reservationTimeout: 15, // minutes
    },
  });
});

// Flash sale analytics
const getFlashSaleAnalytics = catchAsyncErrors(async (req, res, next) => {
  const { flashSaleId } = req.params;
  
  const flashSale = await FlashSale.findById(flashSaleId)
    .populate('products.productId', 'name originalPrice');

  if (!flashSale) {
    return next(new ErrorHandler('Flash sale not found', 404));
  }

  // Calculate analytics
  const totalRevenue = flashSale.products.reduce((sum, product) => {
    return sum + (product.flashPrice * product.sold);
  }, 0);

  const totalQuantitySold = flashSale.products.reduce((sum, product) => {
    return sum + product.sold;
  }, 0);

  const totalQuantityAvailable = flashSale.products.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);

  const conversionRate = totalQuantityAvailable > 0 
    ? (totalQuantitySold / totalQuantityAvailable) * 100 
    : 0;

  const productPerformance = flashSale.products.map(product => ({
    productId: product.productId._id,
    productName: product.productId.name,
    originalPrice: product.productId.originalPrice,
    flashPrice: product.flashPrice,
    quantityAvailable: product.quantity,
    quantitySold: product.sold,
    conversionRate: product.quantity > 0 ? (product.sold / product.quantity) * 100 : 0,
    revenue: product.flashPrice * product.sold,
  }));

  res.status(200).json({
    success: true,
    data: {
      flashSale: {
        id: flashSale._id,
        name: flashSale.name,
        status: flashSale.status,
        startDate: flashSale.startDate,
        endDate: flashSale.endDate,
      },
      analytics: {
        totalRevenue,
        totalQuantitySold,
        totalQuantityAvailable,
        conversionRate: Math.round(conversionRate * 100) / 100,
        productPerformance,
      },
    },
  });
});

// Automated flash sale status management
const updateFlashSaleStatuses = async () => {
  const now = new Date();
  
  try {
    // Start scheduled flash sales
    await FlashSale.updateMany(
      {
        startDate: { $lte: now },
        status: 'scheduled'
      },
      { status: 'active' }
    );

    // End active flash sales
    await FlashSale.updateMany(
      {
        endDate: { $lte: now },
        status: 'active'
      },
      { status: 'expired' }
    );

    console.log('Flash sale statuses updated');
  } catch (error) {
    console.error('Error updating flash sale statuses:', error);
  }
};

// Run every minute to check flash sale statuses
cron.schedule('* * * * *', updateFlashSaleStatuses);

module.exports = {
  createFlashSale,
  getAllFlashSales,
  getActiveFlashSales,
  getFlashSaleById,
  updateFlashSale,
  deleteFlashSale,
  purchaseFlashSaleProduct,
  getFlashSaleAnalytics,
};
