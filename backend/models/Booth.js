const mongoose = require('mongoose');

const boothSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true,
  },
  boothNumber: {
    type: String,
    required: [true, 'Booth number is required'],
  },
  location: {
    x: Number,
    y: Number,
    section: String,
  },
  size: {
    width: Number,
    height: Number,
    area: Number, // in square feet
  },
  price: {
    type: Number,
    required: [true, 'Booth price is required'],
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied', 'maintenance'],
    default: 'available',
  },
  exhibitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reservedAt: {
    type: Date,
  },
  features: [{
    type: String, // e.g., 'electricity', 'internet', 'water', 'storage'
  }],
}, {
  timestamps: true,
});

// Index for efficient queries
boothSchema.index({ expo: 1, boothNumber: 1 }, { unique: true });

module.exports = mongoose.model('Booth', boothSchema);
