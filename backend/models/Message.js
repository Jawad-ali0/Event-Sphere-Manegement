const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  messageType: {
    type: String,
    enum: ['organizer-to-exhibitor', 'exhibitor-to-organizer', 'exhibitor-to-exhibitor'],
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
messageSchema.index({ expo: 1, sender: 1, recipient: 1 });

module.exports = mongoose.model('Message', messageSchema);
