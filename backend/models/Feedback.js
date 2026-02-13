const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  expo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Expo',
    required: false, // Optional, for general feedback
  },
  type: {
    type: String,
    enum: ['suggestion', 'bug', 'general', 'support'],
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  respondedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  respondedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
