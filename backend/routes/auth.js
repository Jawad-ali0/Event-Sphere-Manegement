const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getPasswordResetEmailTemplate, getPasswordResetTextTemplate } = require('../utils/emailTemplates');

// Load environment variables (backup in case server.js doesn't load them)
dotenv.config();

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  // Reload env vars to ensure they're loaded
  dotenv.config();
  
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET from env:', process.env.JWT_SECRET);
    console.error('All env vars:', Object.keys(process.env).filter(k => k.includes('JWT')));
    throw new Error('JWT_SECRET is not configured. Please set it in .env file');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected. Please check MongoDB connection.',
      });
    }

    const { firstName, lastName, email, password, role, phone, companyName } = req.body;

    console.log('Registration attempt:', { email, role, firstName });

    // Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Validate role
    const validRoles = ['admin', 'organizer', 'exhibitor', 'attendee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: admin, organizer, exhibitor, attendee',
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone: phone || '',
      companyName: companyName || '',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors,
        error: error.message,
      });
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
        error: error.message,
      });
    }
    
    // Handle MongoDB connection error
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(500).json({
        success: false,
        message: 'Database connection error. Please check MongoDB connection.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database error',
      });
    }
    
    // Handle JWT secret missing
    if (error.message && error.message.includes('secret')) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. JWT_SECRET is missing.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
    
    // Generic error with detailed message in development
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred. Please try again.',
      errorName: process.env.NODE_ENV === 'development' ? error.name : undefined,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password - generate reset token
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  let user;
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (frontend URL for password reset page)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Email message
    const message = getPasswordResetEmailTemplate(
      resetUrl,
      resetToken,
      `${user.firstName} ${user.lastName}`
    );

    const textMessage = getPasswordResetTextTemplate(
      resetUrl,
      resetToken,
      `${user.firstName} ${user.lastName}`
    );

    // Check if email credentials are configured (not empty strings)
    const emailConfigured = process.env.SMTP_EMAIL && 
                            process.env.SMTP_PASSWORD && 
                            process.env.SMTP_EMAIL !== 'your-email@gmail.com' &&
                            process.env.SMTP_PASSWORD !== 'your-app-password-here';
    
    if (emailConfigured) {
      try {
        // Send email
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Request - EventSphere Management',
          message: textMessage,
          html: message,
        });

        res.status(200).json({
          success: true,
          message: 'Password reset email sent successfully. Please check your email.',
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        
        // If email fails, clear the reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).json({
          success: false,
          message: 'Email could not be sent. Please try again later.',
          error: process.env.NODE_ENV === 'development' ? emailError.message : undefined,
        });
      }
    } else {
      // Development mode: Return token in response if email not configured
      console.warn('⚠️ Email not configured. Returning reset token in response (development mode only).');
      res.status(200).json({
        success: true,
        message: 'Password reset token generated. Email service not configured.',
        resetToken: resetToken, // Only in development
        resetUrl: resetUrl,
        note: 'In production, configure SMTP_EMAIL and SMTP_PASSWORD in .env file',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Only reset token if user was found
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.resettoken;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password',
      });
    }

    // Hash the reset token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   PUT /api/auth/updatepassword
// @desc    Update password (for logged in users)
// @access  Private
router.put('/updatepassword', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token,
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;
