const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/auth');

// Submit feedback (any authenticated user)
router.post('/', protect, async (req, res) => {
  try {
    const { expo, type, subject, message } = req.body;

    if (!type || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Required fields: type, subject, message' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      expo: expo || null,
      type,
      subject,
      message,
    });

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error('Submit feedback error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's feedback
router.get('/me', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    console.error('Get user feedback error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all feedback (admin/organizer)
router.get('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const feedbacks = await Feedback.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('expo', 'title')
      .populate('respondedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    console.error('Get all feedback error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update feedback status/response (admin/organizer)
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { status, priority, adminResponse } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

    if (status) feedback.status = status;
    if (priority) feedback.priority = priority;
    if (adminResponse) {
      feedback.adminResponse = adminResponse;
      feedback.respondedBy = req.user._id;
      feedback.respondedAt = new Date();
    }

    await feedback.save();

    res.status(200).json({ success: true, feedback });
  } catch (err) {
    console.error('Update feedback error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });

    await feedback.remove();

    res.status(200).json({ success: true, message: 'Feedback deleted' });
  } catch (err) {
    console.error('Delete feedback error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
