const mongoose = require('mongoose');

const ExpoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  theme: { type: String },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  floorPlan: {
    // Optional structure to store floor plan metadata or external link
    imageUrl: String,
    width: Number,
    height: Number,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Expo', ExpoSchema);
