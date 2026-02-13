const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const Expo = require('../models/Expo');
const { protect, authorize } = require('../middleware/auth');

// Create schedule for expo (organizer/admin)
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { expo } = req.body;
    if (!expo) return res.status(400).json({ success: false, message: 'Please provide expo id' });

    const expoObj = await Expo.findById(expo);
    if (!expoObj) return res.status(404).json({ success: false, message: 'Expo not found' });

    // Prevent duplicate schedule per expo
    const existing = await Schedule.findOne({ expo });

    if (existing) return res.status(400).json({ success: false, message: 'Schedule already exists for this expo' });

    const schedule = await Schedule.create({ expo, sessions: [] });

    res.status(201).json({ success: true, schedule });
  } catch (err) {
    console.error('Create schedule error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add session to schedule (organizer/admin)
router.post('/:id/sessions', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    const { title, startTime, endTime, speakers, topic, location, capacity, description } = req.body;

    if (!title || !startTime || !endTime) return res.status(400).json({ success: false, message: 'Required fields: title, startTime, endTime' });

    const session = { title, startTime, endTime, speakers: speakers || [], topic, location, capacity, description, createdBy: req.user._id };

    schedule.sessions.push(session);
    await schedule.save();

    // Emit schedule update
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`expo_${schedule.expo}`).emit('schedule:update', { action: 'added', session });
      }
    } catch (emitErr) {
      console.error('Error emitting schedule add event:', emitErr);
    }

    res.status(201).json({ success: true, schedule });
  } catch (err) {
    console.error('Add session error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update session
router.put('/:id/sessions/:sessionId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    const session = schedule.sessions.id(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    Object.assign(session, req.body);

    await schedule.save();

    // Emit schedule update
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`expo_${schedule.expo}`).emit('schedule:update', { action: 'updated', session });
      }
    } catch (emitErr) {
      console.error('Error emitting schedule update event:', emitErr);
    }

    res.status(200).json({ success: true, schedule });
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete session
router.delete('/:id/sessions/:sessionId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    const session = schedule.sessions.id(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.remove();
    await schedule.save();

    // Emit schedule deletion
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`expo_${schedule.expo}`).emit('schedule:update', { action: 'deleted', sessionId: req.params.sessionId });
      }
    } catch (emitErr) {
      console.error('Error emitting schedule delete event:', emitErr);
    }

    res.status(200).json({ success: true, schedule });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get schedule for expo
router.get('/expo/:expoId', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ expo: req.params.expoId }).populate('sessions.speakers', 'firstName lastName companyName');
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
    res.status(200).json({ success: true, schedule });
  } catch (err) {
    console.error('Get schedule error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
