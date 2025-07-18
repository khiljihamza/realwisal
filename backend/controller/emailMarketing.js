const EmailCampaign = require('../model/emailCampaign');
const EmailTemplate = require('../model/emailTemplate');
const User = require('../model/user');
const Order = require('../model/order');
const Product = require('../model/product');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendMail = require('../utils/sendMail');
const cron = require('node-cron');

// Email automation triggers
const EMAIL_TRIGGERS = {
  WELCOME: 'welcome',
  ABANDONED_CART: 'abandoned_cart',
  ORDER_CONFIRMATION: 'order_confirmation',
  SHIPPING_UPDATE: 'shipping_update',
  DELIVERY_CONFIRMATION: 'delivery_confirmation',
  REVIEW_REQUEST: 'review_request',
  WIN_BACK: 'win_back',
  BIRTHDAY: 'birthday',
  LOYALTY_MILESTONE: 'loyalty_milestone',
  FLASH_SALE: 'flash_sale',
  PRICE_DROP: 'price_drop',
  BACK_IN_STOCK: 'back_in_stock',
};

// Create email template
const createEmailTemplate = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    subject,
    htmlContent,
    textContent,
    trigger,
    isActive = true,
    variables = [],
  } = req.body;

  const template = await EmailTemplate.create({
    name,
    subject,
    htmlContent,
    textContent,
    trigger,
    isActive,
    variables,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: template,
  });
});

// Get all email templates
const getAllEmailTemplates = catchAsyncErrors(async (req, res, next) => {
  const { trigger, isActive, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (trigger) query.trigger = trigger;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const templates = await EmailTemplate.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalCount = await EmailTemplate.countDocuments(query);

  res.status(200).json({
    success: true,
    data: templates,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    },
  });
});

// Update email template
const updateEmailTemplate = catchAsyncErrors(async (req, res, next) => {
  const template = await EmailTemplate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!template) {
    return next(new ErrorHandler('Template not found', 404));
  }

  res.status(200).json({
    success: true,
    data: template,
  });
});

// Delete email template
const deleteEmailTemplate = catchAsyncErrors(async (req, res, next) => {
  const template = await EmailTemplate.findById(req.params.id);

  if (!template) {
    return next(new ErrorHandler('Template not found', 404));
  }

  await EmailTemplate.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Template deleted successfully',
  });
});

// Create email campaign
const createEmailCampaign = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    templateId,
    segmentation,
    scheduledDate,
    isRecurring = false,
    recurringPattern,
  } = req.body;

  const template = await EmailTemplate.findById(templateId);
  if (!template) {
    return next(new ErrorHandler('Template not found', 404));
  }

  // Build user query based on segmentation
  const userQuery = buildUserQuery(segmentation);
  const targetUsers = await User.find(userQuery).select('_id email name');

  const campaign = await EmailCampaign.create({
    name,
    templateId,
    segmentation,
    targetUsers: targetUsers.map(user => user._id),
    scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
    isRecurring,
    recurringPattern,
    createdBy: req.user.id,
    stats: {
      totalRecipients: targetUsers.length,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      ...campaign.toObject(),
      estimatedRecipients: targetUsers.length,
    },
  });
});

// Send campaign
const sendCampaign = catchAsyncErrors(async (req, res, next) => {
  const { campaignId } = req.params;
  
  const campaign = await EmailCampaign.findById(campaignId)
    .populate('templateId')
    .populate('targetUsers', 'email name preferences');

  if (!campaign) {
    return next(new ErrorHandler('Campaign not found', 404));
  }

  if (campaign.status === 'sent') {
    return next(new ErrorHandler('Campaign already sent', 400));
  }

  // Update campaign status
  campaign.status = 'sending';
  campaign.sentDate = new Date();
  await campaign.save();

  // Send emails asynchronously
  processCampaignEmails(campaign);

  res.status(200).json({
    success: true,
    message: 'Campaign sending started',
    data: {
      campaignId,
      totalRecipients: campaign.targetUsers.length,
    },
  });
});

// Process campaign emails (background task)
const processCampaignEmails = async (campaign) => {
  const batchSize = 50; // Send emails in batches
  const template = campaign.templateId;
  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < campaign.targetUsers.length; i += batchSize) {
    const batch = campaign.targetUsers.slice(i, i + batchSize);
    
    const emailPromises = batch.map(async (user) => {
      try {
        // Skip if user has unsubscribed
        if (user.preferences?.emailMarketing === false) {
          return { success: false, reason: 'unsubscribed' };
        }

        // Replace variables in template
        const personalizedContent = personalizeContent(template, user, campaign);
        
        await sendMail({
          email: user.email,
          subject: personalizedContent.subject,
          html: personalizedContent.html,
          text: personalizedContent.text,
        });

        sentCount++;
        return { success: true };
      } catch (error) {
        failedCount++;
        console.error(`Failed to send email to ${user.email}:`, error);
        return { success: false, error: error.message };
      }
    });

    await Promise.allSettled(emailPromises);
    
    // Add delay between batches to avoid overwhelming email service
    if (i + batchSize < campaign.targetUsers.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Update campaign stats
  campaign.status = 'sent';
  campaign.stats.sentCount = sentCount;
  campaign.stats.failedCount = failedCount;
  campaign.stats.deliveryRate = (sentCount / campaign.stats.totalRecipients) * 100;
  await campaign.save();

  console.log(`Campaign ${campaign.name} completed: ${sentCount} sent, ${failedCount} failed`);
};

// Trigger automated emails
const triggerAutomatedEmail = catchAsyncErrors(async (req, res, next) => {
  const { trigger, userId, data = {} } = req.body;

  if (!EMAIL_TRIGGERS[trigger.toUpperCase()]) {
    return next(new ErrorHandler('Invalid email trigger', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Skip if user has unsubscribed
  if (user.preferences?.emailMarketing === false) {
    return res.status(200).json({
      success: true,
      message: 'User has unsubscribed from email marketing',
    });
  }

  const template = await EmailTemplate.findOne({
    trigger: trigger.toLowerCase(),
    isActive: true,
  });

  if (!template) {
    return res.status(200).json({
      success: true,
      message: 'No active template found for this trigger',
    });
  }

  try {
    const personalizedContent = personalizeContent(template, user, { data });
    
    await sendMail({
      email: user.email,
      subject: personalizedContent.subject,
      html: personalizedContent.html,
      text: personalizedContent.text,
    });

    res.status(200).json({
      success: true,
      message: 'Automated email sent successfully',
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to send automated email', 500));
  }
});

// Get campaign analytics
const getCampaignAnalytics = catchAsyncErrors(async (req, res, next) => {
  const { campaignId } = req.params;
  
  const campaign = await EmailCampaign.findById(campaignId)
    .populate('templateId', 'name trigger');

  if (!campaign) {
    return next(new ErrorHandler('Campaign not found', 404));
  }

  // Calculate additional metrics
  const openRate = campaign.stats.openCount && campaign.stats.sentCount 
    ? (campaign.stats.openCount / campaign.stats.sentCount) * 100 
    : 0;

  const clickRate = campaign.stats.clickCount && campaign.stats.sentCount
    ? (campaign.stats.clickCount / campaign.stats.sentCount) * 100
    : 0;

  const conversionRate = campaign.stats.conversionCount && campaign.stats.sentCount
    ? (campaign.stats.conversionCount / campaign.stats.sentCount) * 100
    : 0;

  res.status(200).json({
    success: true,
    data: {
      campaign: {
        id: campaign._id,
        name: campaign.name,
        template: campaign.templateId,
        status: campaign.status,
        sentDate: campaign.sentDate,
      },
      stats: {
        ...campaign.stats.toObject(),
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    },
  });
});

// Helper function to build user query based on segmentation
const buildUserQuery = (segmentation) => {
  const query = {};

  if (segmentation.userTier) {
    query['loyaltyProgram.tier'] = segmentation.userTier;
  }

  if (segmentation.lastOrderDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - segmentation.lastOrderDays);
    query.lastOrderDate = { $gte: cutoffDate };
  }

  if (segmentation.totalSpentMin || segmentation.totalSpentMax) {
    query.totalSpent = {};
    if (segmentation.totalSpentMin) query.totalSpent.$gte = segmentation.totalSpentMin;
    if (segmentation.totalSpentMax) query.totalSpent.$lte = segmentation.totalSpentMax;
  }

  if (segmentation.location) {
    query['addresses.city'] = new RegExp(segmentation.location, 'i');
  }

  if (segmentation.emailEngagement) {
    query['preferences.emailMarketing'] = true;
  }

  return query;
};

// Helper function to personalize email content
const personalizeContent = (template, user, campaign) => {
  const variables = {
    firstName: user.name.split(' ')[0],
    fullName: user.name,
    email: user.email,
    ...campaign.data,
  };

  let subject = template.subject;
  let html = template.htmlContent;
  let text = template.textContent;

  // Replace variables in content
  template.variables.forEach(variable => {
    const placeholder = `{{${variable}}}`;
    const value = variables[variable] || '';
    
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    html = html.replace(new RegExp(placeholder, 'g'), value);
    if (text) {
      text = text.replace(new RegExp(placeholder, 'g'), value);
    }
  });

  return { subject, html, text };
};

// Automated email workflows
const runAutomatedWorkflows = async () => {
  try {
    await checkAbandonedCarts();
    await checkWinBackUsers();
    await checkBirthdayUsers();
    await checkReviewRequests();
  } catch (error) {
    console.error('Error running automated workflows:', error);
  }
};

// Check for abandoned carts
const checkAbandonedCarts = async () => {
  // Implementation for abandoned cart emails
  console.log('Checking abandoned carts...');
};

// Check for win-back users
const checkWinBackUsers = async () => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 days inactive

  const inactiveUsers = await User.find({
    lastOrderDate: { $lt: cutoffDate },
    'preferences.emailMarketing': true,
  });

  // Send win-back emails
  console.log(`Found ${inactiveUsers.length} inactive users for win-back campaign`);
};

// Check for birthday users
const checkBirthdayUsers = async () => {
  const today = new Date();
  const birthdayUsers = await User.find({
    'profile.birthdate': {
      $regex: `${today.getMonth() + 1}-${today.getDate()}`,
    },
    'preferences.emailMarketing': true,
  });

  // Send birthday emails
  console.log(`Found ${birthdayUsers.length} users with birthdays today`);
};

// Check for review requests
const checkReviewRequests = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const deliveredOrders = await Order.find({
    status: 'Delivered',
    deliveredAt: { $gte: sevenDaysAgo },
    reviewRequestSent: { $ne: true },
  }).populate('user');

  // Send review request emails
  console.log(`Found ${deliveredOrders.length} orders eligible for review requests`);
};

// Schedule automated workflows to run daily at 9 AM
cron.schedule('0 9 * * *', runAutomatedWorkflows);

module.exports = {
  createEmailTemplate,
  getAllEmailTemplates,
  updateEmailTemplate,
  deleteEmailTemplate,
  createEmailCampaign,
  sendCampaign,
  triggerAutomatedEmail,
  getCampaignAnalytics,
  EMAIL_TRIGGERS,
};
