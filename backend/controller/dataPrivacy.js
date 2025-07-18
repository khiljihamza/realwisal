const User = require('../model/user');
const Order = require('../model/order');
const DataRequest = require('../model/dataRequest');
const ConsentRecord = require('../model/consentRecord');
const AuditLog = require('../model/auditLog');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// GDPR data processing lawful bases
const LAWFUL_BASES = {
  CONSENT: 'consent',
  CONTRACT: 'contract',
  LEGAL_OBLIGATION: 'legal_obligation',
  VITAL_INTERESTS: 'vital_interests',
  PUBLIC_TASK: 'public_task',
  LEGITIMATE_INTERESTS: 'legitimate_interests',
};

// Data categories for GDPR compliance
const DATA_CATEGORIES = {
  PERSONAL: 'personal_data',
  SENSITIVE: 'sensitive_data',
  MARKETING: 'marketing_data',
  ANALYTICS: 'analytics_data',
  TRANSACTION: 'transaction_data',
};

// Record user consent
const recordConsent = catchAsyncErrors(async (req, res, next) => {
  const {
    userId,
    consentType,
    lawfulBasis,
    dataCategories,
    purposes,
    consentText,
    ipAddress,
    userAgent,
  } = req.body;

  if (!userId || !consentType || !lawfulBasis) {
    return next(new ErrorHandler('Missing required consent information', 400));
  }

  const consent = await ConsentRecord.create({
    userId,
    consentType,
    lawfulBasis,
    dataCategories: dataCategories || [DATA_CATEGORIES.PERSONAL],
    purposes: purposes || ['service_provision'],
    consentText,
    ipAddress: ipAddress || req.ip,
    userAgent: userAgent || req.get('User-Agent'),
    consentDate: new Date(),
    isActive: true,
  });

  // Log the consent action
  await AuditLog.create({
    userId,
    action: 'consent_recorded',
    details: {
      consentId: consent._id,
      consentType,
      lawfulBasis,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json({
    success: true,
    data: consent,
  });
});

// Withdraw consent
const withdrawConsent = catchAsyncErrors(async (req, res, next) => {
  const { consentId, reason } = req.body;
  const userId = req.user.id;

  const consent = await ConsentRecord.findOne({
    _id: consentId,
    userId,
    isActive: true,
  });

  if (!consent) {
    return next(new ErrorHandler('Consent record not found', 404));
  }

  // Mark consent as withdrawn
  consent.isActive = false;
  consent.withdrawalDate = new Date();
  consent.withdrawalReason = reason;
  await consent.save();

  // Log the withdrawal
  await AuditLog.create({
    userId,
    action: 'consent_withdrawn',
    details: {
      consentId: consent._id,
      consentType: consent.consentType,
      reason,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(200).json({
    success: true,
    message: 'Consent withdrawn successfully',
  });
});

// Get user's consent history
const getUserConsents = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;

  const consents = await ConsentRecord.find({ userId })
    .sort({ consentDate: -1 });

  res.status(200).json({
    success: true,
    data: consents,
  });
});

// Submit data request (access, portability, erasure)
const submitDataRequest = catchAsyncErrors(async (req, res, next) => {
  const { requestType, description, verificationData } = req.body;
  const userId = req.user.id;

  const validRequestTypes = ['access', 'portability', 'erasure', 'rectification'];
  if (!validRequestTypes.includes(requestType)) {
    return next(new ErrorHandler('Invalid request type', 400));
  }

  // Check if there's already a pending request
  const pendingRequest = await DataRequest.findOne({
    userId,
    requestType,
    status: 'pending',
  });

  if (pendingRequest) {
    return next(new ErrorHandler(`You already have a pending ${requestType} request`, 400));
  }

  const dataRequest = await DataRequest.create({
    userId,
    requestType,
    description,
    verificationData,
    submissionDate: new Date(),
    status: 'pending',
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Log the request
  await AuditLog.create({
    userId,
    action: 'data_request_submitted',
    details: {
      requestId: dataRequest._id,
      requestType,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json({
    success: true,
    data: dataRequest,
    message: 'Data request submitted successfully. We will process it within 30 days.',
  });
});

// Process data access request
const processDataAccessRequest = catchAsyncErrors(async (req, res, next) => {
  const { requestId } = req.params;
  
  const dataRequest = await DataRequest.findById(requestId)
    .populate('userId', 'name email');

  if (!dataRequest || dataRequest.requestType !== 'access') {
    return next(new ErrorHandler('Data access request not found', 404));
  }

  if (dataRequest.status !== 'pending') {
    return next(new ErrorHandler('Request has already been processed', 400));
  }

  const userId = dataRequest.userId._id;
  
  // Collect all user data
  const userData = await collectUserData(userId);
  
  // Generate data export file
  const exportData = {
    exportDate: new Date().toISOString(),
    user: dataRequest.userId,
    data: userData,
    dataCategories: Object.values(DATA_CATEGORIES),
    retentionPeriods: await getDataRetentionPeriods(),
  };

  // Create export file
  const filename = `data_export_${userId}_${Date.now()}.json`;
  const filePath = path.join('exports', filename);
  
  await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));

  // Update request status
  dataRequest.status = 'completed';
  dataRequest.completionDate = new Date();
  dataRequest.exportFilePath = filePath;
  await dataRequest.save();

  // Log completion
  await AuditLog.create({
    userId,
    action: 'data_access_completed',
    details: {
      requestId: dataRequest._id,
      exportFile: filename,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(200).json({
    success: true,
    message: 'Data access request processed successfully',
    downloadUrl: `/api/v2/privacy/download/${filename}`,
  });
});

// Process data erasure request (Right to be forgotten)
const processDataErasureRequest = catchAsyncErrors(async (req, res, next) => {
  const { requestId } = req.params;
  const { adminApproval = false } = req.body;

  const dataRequest = await DataRequest.findById(requestId)
    .populate('userId', 'name email');

  if (!dataRequest || dataRequest.requestType !== 'erasure') {
    return next(new ErrorHandler('Data erasure request not found', 404));
  }

  if (dataRequest.status !== 'pending') {
    return next(new ErrorHandler('Request has already been processed', 400));
  }

  const userId = dataRequest.userId._id;

  // Check if erasure is legally permissible
  const erasureCheck = await checkErasurePermissibility(userId);
  
  if (!erasureCheck.allowed && !adminApproval) {
    dataRequest.status = 'rejected';
    dataRequest.completionDate = new Date();
    dataRequest.rejectionReason = erasureCheck.reason;
    await dataRequest.save();

    return res.status(200).json({
      success: false,
      message: `Erasure request rejected: ${erasureCheck.reason}`,
    });
  }

  // Perform data erasure
  await performDataErasure(userId);

  // Update request status
  dataRequest.status = 'completed';
  dataRequest.completionDate = new Date();
  await dataRequest.save();

  // Log erasure
  await AuditLog.create({
    userId,
    action: 'data_erasure_completed',
    details: {
      requestId: dataRequest._id,
      adminApproval,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(200).json({
    success: true,
    message: 'Data erasure request processed successfully',
  });
});

// Get all data requests (admin)
const getAllDataRequests = catchAsyncErrors(async (req, res, next) => {
  const { status, requestType, page = 1, limit = 20 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (requestType) query.requestType = requestType;

  const requests = await DataRequest.find(query)
    .populate('userId', 'name email')
    .sort({ submissionDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalCount = await DataRequest.countDocuments(query);

  res.status(200).json({
    success: true,
    data: requests,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  });
});

// Update data request status (admin)
const updateDataRequestStatus = catchAsyncErrors(async (req, res, next) => {
  const { requestId } = req.params;
  const { status, adminNotes } = req.body;

  const validStatuses = ['pending', 'in_progress', 'completed', 'rejected'];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler('Invalid status', 400));
  }

  const dataRequest = await DataRequest.findByIdAndUpdate(
    requestId,
    {
      status,
      adminNotes,
      ...(status === 'completed' && { completionDate: new Date() }),
    },
    { new: true }
  ).populate('userId', 'name email');

  if (!dataRequest) {
    return next(new ErrorHandler('Data request not found', 404));
  }

  // Log status update
  await AuditLog.create({
    userId: dataRequest.userId._id,
    action: 'data_request_status_updated',
    details: {
      requestId: dataRequest._id,
      oldStatus: dataRequest.status,
      newStatus: status,
      adminNotes,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    adminId: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: dataRequest,
  });
});

// Helper function to collect all user data
const collectUserData = async (userId) => {
  const [user, orders, consents, auditLogs] = await Promise.all([
    User.findById(userId).lean(),
    Order.find({ user: userId }).lean(),
    ConsentRecord.find({ userId }).lean(),
    AuditLog.find({ userId }).lean(),
  ]);

  return {
    profile: user,
    orders,
    consents,
    auditLogs,
    // Add other data sources as needed
  };
};

// Helper function to check if erasure is permissible
const checkErasurePermissibility = async (userId) => {
  // Check for ongoing orders
  const pendingOrders = await Order.countDocuments({
    user: userId,
    status: { $in: ['Processing', 'Shipping', 'On the way'] },
  });

  if (pendingOrders > 0) {
    return {
      allowed: false,
      reason: 'User has pending orders that require personal data retention',
    };
  }

  // Check for legal retention requirements
  const recentOrders = await Order.countDocuments({
    user: userId,
    createdAt: { $gte: new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000) }, // 7 years
  });

  if (recentOrders > 0) {
    return {
      allowed: false,
      reason: 'Legal retention period for transaction data has not expired',
    };
  }

  return { allowed: true };
};

// Helper function to perform data erasure
const performDataErasure = async (userId) => {
  // Anonymize user data instead of deletion to maintain referential integrity
  const anonymizedData = {
    name: 'DELETED_USER',
    email: `deleted_${crypto.randomBytes(8).toString('hex')}@example.com`,
    password: 'DELETED',
    phoneNumber: 'DELETED',
    addresses: [],
    avatar: null,
    isDeleted: true,
    deletedAt: new Date(),
  };

  await User.findByIdAndUpdate(userId, anonymizedData);

  // Anonymize order data (keep for business records but remove personal info)
  await Order.updateMany(
    { user: userId },
    {
      $unset: {
        'shippingAddress.address1': 1,
        'shippingAddress.address2': 1,
        'shippingAddress.city': 1,
        'shippingAddress.state': 1,
        'shippingAddress.country': 1,
        'shippingAddress.zipCode': 1,
      },
    }
  );

  // Mark consents as erased
  await ConsentRecord.updateMany(
    { userId },
    { isErased: true, erasureDate: new Date() }
  );
};

// Get data retention periods
const getDataRetentionPeriods = async () => {
  return {
    [DATA_CATEGORIES.PERSONAL]: '7 years after last transaction',
    [DATA_CATEGORIES.MARKETING]: 'Until consent withdrawal',
    [DATA_CATEGORIES.ANALYTICS]: '2 years',
    [DATA_CATEGORIES.TRANSACTION]: '7 years (legal requirement)',
  };
};

// Privacy policy and terms tracking
const trackPolicyAcceptance = catchAsyncErrors(async (req, res, next) => {
  const { policyType, version, acceptanceMethod } = req.body;
  const userId = req.user.id;

  await ConsentRecord.create({
    userId,
    consentType: `policy_acceptance_${policyType}`,
    lawfulBasis: LAWFUL_BASES.CONSENT,
    dataCategories: [DATA_CATEGORIES.PERSONAL],
    purposes: ['legal_compliance'],
    consentText: `Accepted ${policyType} version ${version}`,
    consentDate: new Date(),
    isActive: true,
    metadata: {
      policyVersion: version,
      acceptanceMethod,
    },
  });

  await AuditLog.create({
    userId,
    action: 'policy_accepted',
    details: {
      policyType,
      version,
      acceptanceMethod,
    },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(200).json({
    success: true,
    message: 'Policy acceptance recorded',
  });
});

module.exports = {
  recordConsent,
  withdrawConsent,
  getUserConsents,
  submitDataRequest,
  processDataAccessRequest,
  processDataErasureRequest,
  getAllDataRequests,
  updateDataRequestStatus,
  trackPolicyAcceptance,
  LAWFUL_BASES,
  DATA_CATEGORIES,
};
