const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // [cite: 50]
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Event', EventSchema);