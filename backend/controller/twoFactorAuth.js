const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../model/user');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');

// Generate 2FA secret for user
const generateTwoFactorSecret = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Check if 2FA is already enabled
  if (user.twoFactorAuth && user.twoFactorAuth.enabled) {
    return next(new ErrorHandler('Two-factor authentication is already enabled', 400));
  }

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `ECommerce Pro (${user.email})`,
    issuer: 'ECommerce Pro',
    length: 20,
  });

  // Store temporary secret (not enabled until verified)
  user.twoFactorAuth = {
    tempSecret: secret.base32,
    enabled: false,
    backupCodes: [],
  };

  await user.save();

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  res.status(200).json({
    success: true,
    data: {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    },
  });
});

// Enable 2FA after verification
const enableTwoFactorAuth = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;
  
  if (!token) {
    return next(new ErrorHandler('Verification token is required', 400));
  }

  const user = await User.findById(req.user.id);
  
  if (!user || !user.twoFactorAuth || !user.twoFactorAuth.tempSecret) {
    return next(new ErrorHandler('No pending 2FA setup found', 400));
  }

  // Verify the token
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorAuth.tempSecret,
    encoding: 'base32',
    token: token,
    window: 2, // Allow 2 time steps tolerance
  });

  if (!verified) {
    return next(new ErrorHandler('Invalid verification token', 400));
  }

  // Generate backup codes
  const backupCodes = [];
  for (let i = 0; i < 8; i++) {
    backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }

  // Enable 2FA
  user.twoFactorAuth = {
    secret: user.twoFactorAuth.tempSecret,
    enabled: true,
    backupCodes: backupCodes.map(code => ({
      code: crypto.createHash('sha256').update(code).digest('hex'),
      used: false,
    })),
  };

  // Remove temp secret
  user.twoFactorAuth.tempSecret = undefined;
  
  await user.save();

  // Send backup codes via email
  try {
    await sendMail({
      email: user.email,
      subject: 'Two-Factor Authentication Backup Codes',
      html: `
        <h2>Two-Factor Authentication Enabled</h2>
        <p>Your backup codes (store these securely):</p>
        <ul>
          ${backupCodes.map(code => `<li><strong>${code}</strong></li>`).join('')}
        </ul>
        <p><strong>Important:</strong> Each backup code can only be used once. Store these codes in a safe place.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send backup codes email:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Two-factor authentication enabled successfully',
    backupCodes, // Return codes once for user to save
  });
});

// Disable 2FA
const disableTwoFactorAuth = catchAsyncErrors(async (req, res, next) => {
  const { password, token } = req.body;
  
  if (!password) {
    return next(new ErrorHandler('Password is required to disable 2FA', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new ErrorHandler('Invalid password', 401));
  }

  // If 2FA is enabled, require token verification
  if (user.twoFactorAuth && user.twoFactorAuth.enabled) {
    if (!token) {
      return next(new ErrorHandler('2FA token is required', 400));
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (!verified) {
      return next(new ErrorHandler('Invalid 2FA token', 400));
    }
  }

  // Disable 2FA
  user.twoFactorAuth = {
    enabled: false,
    secret: null,
    backupCodes: [],
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Two-factor authentication disabled successfully',
  });
});

// Verify 2FA token during login
const verifyTwoFactorToken = (secret, token, backupCodes = []) => {
  // First try TOTP verification
  const totpVerified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2,
  });

  if (totpVerified) {
    return { success: true, usedBackupCode: false };
  }

  // If TOTP fails, try backup codes
  const hashedToken = crypto.createHash('sha256').update(token.toUpperCase()).digest('hex');
  const backupCode = backupCodes.find(code => code.code === hashedToken && !code.used);

  if (backupCode) {
    backupCode.used = true;
    return { success: true, usedBackupCode: true, backupCode };
  }

  return { success: false };
};

// Get 2FA status
const getTwoFactorStatus = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('twoFactorAuth');
  
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const remainingBackupCodes = user.twoFactorAuth?.backupCodes?.filter(code => !code.used).length || 0;

  res.status(200).json({
    success: true,
    data: {
      enabled: user.twoFactorAuth?.enabled || false,
      remainingBackupCodes,
    },
  });
});

// Regenerate backup codes
const regenerateBackupCodes = catchAsyncErrors(async (req, res, next) => {
  const { password, token } = req.body;
  
  if (!password || !token) {
    return next(new ErrorHandler('Password and 2FA token are required', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  
  if (!user || !user.twoFactorAuth?.enabled) {
    return next(new ErrorHandler('2FA is not enabled', 400));
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new ErrorHandler('Invalid password', 401));
  }

  // Verify 2FA token
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorAuth.secret,
    encoding: 'base32',
    token: token,
    window: 2,
  });

  if (!verified) {
    return next(new ErrorHandler('Invalid 2FA token', 400));
  }

  // Generate new backup codes
  const backupCodes = [];
  for (let i = 0; i < 8; i++) {
    backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }

  // Update user with new backup codes
  user.twoFactorAuth.backupCodes = backupCodes.map(code => ({
    code: crypto.createHash('sha256').update(code).digest('hex'),
    used: false,
  }));

  await user.save();

  // Send new backup codes via email
  try {
    await sendMail({
      email: user.email,
      subject: 'New Two-Factor Authentication Backup Codes',
      html: `
        <h2>New Backup Codes Generated</h2>
        <p>Your new backup codes (previous codes are now invalid):</p>
        <ul>
          ${backupCodes.map(code => `<li><strong>${code}</strong></li>`).join('')}
        </ul>
        <p><strong>Important:</strong> Each backup code can only be used once. Store these codes in a safe place.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send new backup codes email:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Backup codes regenerated successfully',
    backupCodes,
  });
});

module.exports = {
  generateTwoFactorSecret,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  verifyTwoFactorToken,
  getTwoFactorStatus,
  regenerateBackupCodes,
};
