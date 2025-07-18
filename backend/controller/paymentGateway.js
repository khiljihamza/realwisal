const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PayPal = require('@paypal/checkout-server-sdk');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Order = require('../model/order');

// Initialize payment gateways
const paypalClient = () => {
  const environment = process.env.NODE_ENV === 'production' 
    ? new PayPal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new PayPal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
  
  return new PayPal.core.PayPalHttpClient(environment);
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Payment Gateway Service
class PaymentGatewayService {
  static async processStripePayment(paymentData) {
    try {
      const { amount, currency, paymentMethodId, customerId, metadata } = paymentData;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        payment_method: paymentMethodId,
        customer: customerId,
        metadata,
        confirmation_method: 'manual',
        confirm: true,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
      });

      return {
        success: true,
        paymentIntent,
        requiresAction: paymentIntent.status === 'requires_action',
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  static async processPayPalPayment(paymentData) {
    try {
      const { amount, currency, orderId } = paymentData;

      const request = new PayPal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency || 'USD',
            value: amount.toString(),
          },
          reference_id: orderId,
        }],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        },
      });

      const response = await paypalClient().execute(request);
      
      return {
        success: true,
        orderId: response.result.id,
        approvalUrl: response.result.links.find(link => link.rel === 'approve')?.href,
      };
    } catch (error) {
      throw new Error(`PayPal payment failed: ${error.message}`);
    }
  }

  static async processRazorpayPayment(paymentData) {
    try {
      const { amount, currency, orderId, customerInfo } = paymentData;

      const options = {
        amount: Math.round(amount * 100), // Convert to paisa
        currency: currency || 'INR',
        receipt: orderId,
        payment_capture: 1,
        notes: {
          customer_id: customerInfo.id,
          order_id: orderId,
        },
      };

      const order = await razorpayInstance.orders.create(options);

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      throw new Error(`Razorpay payment failed: ${error.message}`);
    }
  }

  static async verifyRazorpayPayment(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpay_signature;
    } catch (error) {
      throw new Error(`Razorpay verification failed: ${error.message}`);
    }
  }

  static async capturePayPalPayment(orderId) {
    try {
      const request = new PayPal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      
      const response = await paypalClient().execute(request);
      return {
        success: true,
        captureId: response.result.purchase_units[0].payments.captures[0].id,
        status: response.result.status,
      };
    } catch (error) {
      throw new Error(`PayPal capture failed: ${error.message}`);
    }
  }
}

// API Endpoints
const initializePayment = catchAsyncErrors(async (req, res, next) => {
  const { 
    gateway, 
    amount, 
    currency, 
    orderId, 
    paymentMethodId, 
    customerId,
    customerInfo 
  } = req.body;

  if (!gateway || !amount || !orderId) {
    return next(new ErrorHandler('Missing required payment parameters', 400));
  }

  try {
    let result;

    switch (gateway.toLowerCase()) {
      case 'stripe':
        if (!paymentMethodId) {
          return next(new ErrorHandler('Payment method ID required for Stripe', 400));
        }
        result = await PaymentGatewayService.processStripePayment({
          amount,
          currency,
          paymentMethodId,
          customerId,
          metadata: { orderId }
        });
        break;

      case 'paypal':
        result = await PaymentGatewayService.processPayPalPayment({
          amount,
          currency,
          orderId
        });
        break;

      case 'razorpay':
        result = await PaymentGatewayService.processRazorpayPayment({
          amount,
          currency,
          orderId,
          customerInfo
        });
        break;

      default:
        return next(new ErrorHandler('Unsupported payment gateway', 400));
    }

    // Update order with payment information
    await Order.findByIdAndUpdate(orderId, {
      'paymentInfo.gateway': gateway,
      'paymentInfo.status': 'pending',
      'paymentInfo.gatewayOrderId': result.orderId || result.paymentIntent?.id,
    });

    res.status(200).json({
      success: true,
      gateway,
      data: result,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const confirmPayment = catchAsyncErrors(async (req, res, next) => {
  const { gateway, orderId, paymentData } = req.body;

  if (!gateway || !orderId) {
    return next(new ErrorHandler('Gateway and order ID are required', 400));
  }

  try {
    let isPaymentValid = false;

    switch (gateway.toLowerCase()) {
      case 'stripe':
        // Stripe confirmation is handled on the client side
        // Verify the payment intent here if needed
        if (paymentData.paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentData.paymentIntentId);
          isPaymentValid = paymentIntent.status === 'succeeded';
        }
        break;

      case 'paypal':
        if (paymentData.paypalOrderId) {
          const captureResult = await PaymentGatewayService.capturePayPalPayment(paymentData.paypalOrderId);
          isPaymentValid = captureResult.success && captureResult.status === 'COMPLETED';
        }
        break;

      case 'razorpay':
        if (paymentData.razorpay_payment_id) {
          isPaymentValid = await PaymentGatewayService.verifyRazorpayPayment(paymentData);
        }
        break;

      default:
        return next(new ErrorHandler('Unsupported payment gateway', 400));
    }

    if (isPaymentValid) {
      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.status': 'paid',
        'paymentInfo.paidAt': new Date(),
        'paymentInfo.transactionId': paymentData.transactionId || paymentData.paymentIntentId || paymentData.razorpay_payment_id,
        status: 'Processing',
      });

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        orderId,
      });
    } else {
      // Update order status to failed
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.status': 'failed',
        status: 'Payment Failed',
      });

      return next(new ErrorHandler('Payment verification failed', 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const refundPayment = catchAsyncErrors(async (req, res, next) => {
  const { orderId, amount, reason } = req.body;

  if (!orderId) {
    return next(new ErrorHandler('Order ID is required', 400));
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    const gateway = order.paymentInfo.gateway;
    const transactionId = order.paymentInfo.transactionId;
    
    if (!transactionId) {
      return next(new ErrorHandler('No transaction ID found for refund', 400));
    }

    let refundResult;

    switch (gateway.toLowerCase()) {
      case 'stripe':
        refundResult = await stripe.refunds.create({
          payment_intent: transactionId,
          amount: amount ? Math.round(amount * 100) : undefined,
          reason: reason || 'requested_by_customer',
          metadata: { orderId },
        });
        break;

      case 'paypal':
        // PayPal refund implementation
        const request = new PayPal.payments.CapturesRefundRequest(transactionId);
        request.requestBody({
          amount: amount ? {
            currency_code: order.paymentInfo.currency || 'USD',
            value: amount.toString(),
          } : undefined,
          note_to_payer: reason || 'Refund processed',
        });
        refundResult = await paypalClient().execute(request);
        break;

      case 'razorpay':
        refundResult = await razorpayInstance.payments.refund(transactionId, {
          amount: amount ? Math.round(amount * 100) : undefined,
          notes: {
            reason: reason || 'Customer request',
            order_id: orderId,
          },
        });
        break;

      default:
        return next(new ErrorHandler('Refund not supported for this gateway', 400));
    }

    // Update order with refund information
    await Order.findByIdAndUpdate(orderId, {
      'paymentInfo.refundStatus': 'refunded',
      'paymentInfo.refundId': refundResult.id,
      'paymentInfo.refundAmount': amount || order.totalPrice,
      'paymentInfo.refundedAt': new Date(),
      status: 'Refunded',
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refundId: refundResult.id,
      amount: amount || order.totalPrice,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getPaymentMethods = catchAsyncErrors(async (req, res, next) => {
  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      type: 'card',
      gateway: 'stripe',
      isActive: !!process.env.STRIPE_SECRET_KEY,
      supportedCountries: ['US', 'GB', 'CA', 'AU', 'IN', 'SG'],
      currencies: ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'INR', 'SGD'],
      icon: '/icons/stripe.png',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'wallet',
      gateway: 'paypal',
      isActive: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      supportedCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR'],
      currencies: ['USD', 'GBP', 'EUR', 'CAD', 'AUD'],
      icon: '/icons/paypal.png',
    },
    {
      id: 'razorpay',
      name: 'UPI / Net Banking',
      type: 'upi',
      gateway: 'razorpay',
      isActive: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      supportedCountries: ['IN'],
      currencies: ['INR'],
      icon: '/icons/razorpay.png',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      type: 'cod',
      gateway: 'cod',
      isActive: true,
      supportedCountries: ['IN', 'PK', 'BD'],
      currencies: ['INR', 'PKR', 'BDT'],
      icon: '/icons/cod.png',
    },
  ];

  const activePaymentMethods = paymentMethods.filter(method => method.isActive);

  res.status(200).json({
    success: true,
    data: activePaymentMethods,
  });
});

const getPaymentStatus = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId) {
    return next(new ErrorHandler('Order ID is required', 400));
  }

  try {
    const order = await Order.findById(orderId).select('paymentInfo status totalPrice');
    
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        orderId,
        paymentStatus: order.paymentInfo.status,
        orderStatus: order.status,
        gateway: order.paymentInfo.gateway,
        transactionId: order.paymentInfo.transactionId,
        amount: order.totalPrice,
        paidAt: order.paymentInfo.paidAt,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  initializePayment,
  confirmPayment,
  refundPayment,
  getPaymentMethods,
  getPaymentStatus,
};
