const mongoose = require('mongoose');

const attendeeRegistrationSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true,
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  sessions: [{
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule.sessions',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  bookmarkedSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule.sessions',
  }],
  visitedBooths: [{
    booth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booth',
    },
    visitedAt: {
      type: Date,
    },
  }],
}, {
  timestamps: true,
});

// Index for efficient queries
attendeeRegistrationSchema.index({ expo: 1, attendee: 1 }, { unique: true });

module.exports = mongoose.model('AttendeeRegistration', attendeeRegistrationSchema);
