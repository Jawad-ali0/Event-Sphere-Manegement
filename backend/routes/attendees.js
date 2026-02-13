const express = require('express');
const router = express.Router();
const AttendeeRegistration = require('../models/AttendeeRegistration');
const Expo = require('../models/Expo');
const Schedule = require('../models/Schedule');
const { protect, authorize } = require('../middleware/auth');

// Register attendee for expo
router.post('/register', protect, authorize('attendee'), async (req, res) => {
  try {
    const { expo } = req.body;
    if (!expo) return res.status(400).json({ success: false, message: 'Please provide expo id' });

    const expoObj = await Expo.findById(expo);
    if (!expoObj) return res.status(404).json({ success: false, message: 'Expo not found' });

    const existing = await AttendeeRegistration.findOne({ expo, attendee: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered' });

    const reg = await AttendeeRegistration.create({ expo, attendee: req.user._id });

    res.status(201).json({ success: true, reg });
  } catch (err) {
    console.error('Attendee register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Bookmark session
router.post('/bookmark-session', protect, authorize('attendee'), async (req, res) => {
  try {
    const { expo, sessionId } = req.body;
    if (!expo || !sessionId) return res.status(400).json({ success: false, message: 'Please provide expo and sessionId' });

    const reg = await AttendeeRegistration.findOne({ expo, attendee: req.user._id });
    if (!reg) return res.status(404).json({ success: false, message: 'Please register for expo first' });

    if (!reg.bookmarkedSessions) reg.bookmarkedSessions = [];
    if (reg.bookmarkedSessions.includes(sessionId)) return res.status(400).json({ success: false, message: 'Already bookmarked' });

    reg.bookmarkedSessions.push(sessionId);
    await reg.save();

    res.status(200).json({ success: true, reg });
  } catch (err) {
    console.error('Bookmark session error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register for session
router.post('/register-session', protect, authorize('attendee'), async (req, res) => {
  try {
    const { expo, sessionId } = req.body;
    if (!expo || !sessionId) return res.status(400).json({ success: false, message: 'Please provide expo and sessionId' });

    const reg = await AttendeeRegistration.findOne({ expo, attendee: req.user._id });
    if (!reg) return res.status(404).json({ success: false, message: 'Please register for expo first' });

    if (!reg.sessions) reg.sessions = [];
    const alreadyRegistered = reg.sessions.some(s => s.session.toString() === sessionId);
    if (alreadyRegistered) return res.status(400).json({ success: false, message: 'Already registered for this session' });

    reg.sessions.push({ session: sessionId });
    await reg.save();

    res.status(200).json({ success: true, reg });
  } catch (err) {
    console.error('Register session error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Unbookmark session
router.delete('/bookmark-session', protect, authorize('attendee'), async (req, res) => {
  try {
    const { expo, sessionId } = req.body;
    if (!expo || !sessionId) return res.status(400).json({ success: false, message: 'Please provide expo and sessionId' });

    const reg = await AttendeeRegistration.findOne({ expo, attendee: req.user._id });
    if (!reg) return res.status(404).json({ success: false, message: 'Please register for expo first' });

    reg.bookmarkedSessions = reg.bookmarkedSessions.filter(id => id.toString() !== sessionId);
    await reg.save();

    res.status(200).json({ success: true, reg });
  } catch (err) {
    console.error('Unbookmark session error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get my registrations
router.get('/me', protect, async (req, res) => {
  try {
    const regs = await AttendeeRegistration.find({ attendee: req.user._id }).populate('expo');
    res.status(200).json({ success: true, regs });
  } catch (err) {
    console.error('Get attendee regs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
