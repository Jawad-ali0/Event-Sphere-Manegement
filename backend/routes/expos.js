const express = require('express');
const router = express.Router();
const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const { protect, authorize } = require('../middleware/auth');

// Create expo (organizer or admin)
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { title, startDate, endDate, location, description, theme, floorPlan } = req.body;

    if (!title || !startDate || !endDate || !location) {
      return res.status(400).json({ success: false, message: 'Required fields: title, startDate, endDate, location' });
    }

    const expo = await Expo.create({
      title,
      startDate,
      endDate,
      location,
      description,
      theme,
      floorPlan,
      organizer: req.user._id,
    });

    res.status(201).json({ success: true, expo });
  } catch (err) {
    console.error('Create expo error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all expos (public)
router.get('/', async (req, res) => {
  try {
    const expos = await Expo.find().sort({ startDate: 1 });
    res.status(200).json({ success: true, expos });
  } catch (err) {
    console.error('Get expos error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single expo
router.get('/:id', async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ success: false, message: 'Expo not found' });
    res.status(200).json({ success: true, expo });
  } catch (err) {
    console.error('Get expo error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update expo (organizer or admin)
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ success: false, message: 'Expo not found' });

    if (expo.organizer && expo.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this expo' });
    }

    Object.assign(expo, req.body);
    await expo.save();

    res.status(200).json({ success: true, expo });
  } catch (err) {
    console.error('Update expo error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete expo (organizer or admin)
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ success: false, message: 'Expo not found' });

    if (expo.organizer && expo.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expo' });
    }

    // Remove associated booths
    await Booth.deleteMany({ expo: expo._id });

    await expo.remove();

    res.status(200).json({ success: true, message: 'Expo deleted' });
  } catch (err) {
    console.error('Delete expo error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get booths for an expo
router.get('/:id/booths', async (req, res) => {
  try {
    const booths = await Booth.find({ expo: req.params.id }).populate('exhibitor', 'firstName lastName email companyName');
    res.status(200).json({ success: true, booths });
  } catch (err) {
    console.error('Get expo booths error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
