const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'organizer', 'exhibitor', 'attendee'],
    required: [true, 'Role is required'],
    default: 'attendee',
  },
  phone: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  // User's personal Gmail settings for sending emails
  smtpEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: null, // Optional - user can configure their own Gmail
  },
  // We store SMTP password encrypted. Use helper methods below to set / get.
  smtpPassword: {
    type: String,
    default: null, // Encrypted - user's Gmail password (iv:encrypted)
    select: false, // Don't return by default
  },
  smtpConfigured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash password if it's been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate reset token
userSchema.methods.getResetPasswordToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// SMTP password encryption helpers
userSchema.methods.setSmtpPassword = function (plainPassword) {
  const crypto = require('crypto');
  const key = process.env.SMTP_ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error('SMTP_ENCRYPTION_KEY must be set and 32 bytes long');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(plainPassword, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Store as iv:encrypted
  this.smtpPassword = iv.toString('hex') + ':' + encrypted;
};

userSchema.methods.getSmtpPassword = function () {
  const crypto = require('crypto');
  const key = process.env.SMTP_ENCRYPTION_KEY;
  if (!this.smtpPassword) return null;
  if (!key || key.length < 32) {
    throw new Error('SMTP_ENCRYPTION_KEY must be set and 32 bytes long');
  }

  const [ivHex, encrypted] = this.smtpPassword.split(':');
  if (!ivHex || !encrypted) return null;
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = mongoose.model('User', userSchema);
