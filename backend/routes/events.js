const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const { protect, authorize } = require('../middleware/auth');

// Create a new event (organizer or admin only)
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { title, date, location, description } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ success: false, message: 'Title, date and location are required' });
    }

    // Attach organizer from authenticated user
    const event = await Event.create({ title, date, location, description, organizer: req.user._id });

    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error('Error creating event:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    
    // For each event, fetch the associated expo and its booths with products/services
    const eventsWithExpos = await Promise.all(events.map(async (event) => {
      const expo = await Expo.findOne({ event: event._id });
      let booths = [];
      if (expo) {
        booths = await Booth.find({ expo: expo._id });
      }
      return {
        ...event.toObject(),
        expo: expo ? { ...expo.toObject(), booths } : null
      };
    }));
    
    return res.status(200).json({ success: true, events: eventsWithExpos });
  } catch (err) {
    console.error('Error fetching events:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get events for the authenticated organizer (organizer/admin only)
router.get('/mine', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });
    
    // For each event, fetch the associated expo and its booths with products/services
    const eventsWithExpos = await Promise.all(events.map(async (event) => {
      const expo = await Expo.findOne({ event: event._id });
      let booths = [];
      if (expo) {
        booths = await Booth.find({ expo: expo._id });
      }
      return {
        ...event.toObject(),
        expo: expo ? { ...expo.toObject(), booths } : null
      };
    }));
    
    return res.status(200).json({ success: true, events: eventsWithExpos });
  } catch (err) {
    console.error('Error fetching organizer events:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single event by id (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Fetch the associated expo and its booths with products/services
    const expo = await Expo.findOne({ event: event._id });
    let booths = [];
    if (expo) {
      booths = await Booth.find({ expo: expo._id });
    }
    
    const eventWithExpo = {
      ...event.toObject(),
      expo: expo ? { ...expo.toObject(), booths } : null
    };
    
    return res.status(200).json({ success: true, event: eventWithExpo });
  } catch (err) {
    console.error('Error fetching event:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update event (organizer or admin only)
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Only the organizer who created the event or an admin can update
    if (event.organizer && event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    const { title, date, location, description } = req.body;

    if (title) event.title = title;
    if (date) event.date = date;
    if (location) event.location = location;
    if (description) event.description = description;

    await event.save();

    return res.status(200).json({ success: true, event });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete event (organizer or admin only)
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Only the organizer who created the event or an admin can delete
    if (event.organizer && event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.remove();

    return res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
