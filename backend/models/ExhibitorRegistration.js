const mongoose = require('mongoose');

const exhibitorRegistrationSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true,
  },
  exhibitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
  },
  companyDescription: {
    type: String,
  },
  productsServices: [{
    name: String,
    description: String,
    category: String,
  }],
  documents: [{
    name: String,
    url: String,
    type: String, // 'license', 'certificate', 'other'
  }],
  logo: {
    type: String, // URL or file path
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  booth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booth',
  },
  staff: [{
    name: String,
    email: String,
    phone: String,
    role: String,
  }],
  notes: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
exhibitorRegistrationSchema.index({ expo: 1, exhibitor: 1 }, { unique: true });

module.exports = mongoose.model('ExhibitorRegistration', exhibitorRegistrationSchema);
