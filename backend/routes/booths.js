const express = require('express');
const router = express.Router();
const Booth = require('../models/Booth');
const Expo = require('../models/Expo');
const { protect, authorize } = require('../middleware/auth');

// Create booth for an expo (organizer/admin)
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { expo, boothNumber, location, size, price, features } = req.body;

    if (!expo || !boothNumber || !price) {
      return res.status(400).json({ success: false, message: 'Required fields: expo, boothNumber, price' });
    }

    const existingExpo = await Expo.findById(expo);
    if (!existingExpo) return res.status(404).json({ success: false, message: 'Expo not found' });

    const booth = await Booth.create({ expo, boothNumber, location: location || {}, size: size || {}, price, features: features || [] });

    res.status(201).json({ success: true, booth });
  } catch (err) {
    console.error('Create booth error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Booth number already exists for this expo' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get booths for expo (public)
router.get('/expo/:expoId', async (req, res) => {
  try {
    const booths = await Booth.find({ expo: req.params.expoId }).populate('exhibitor', 'firstName lastName email companyName');
    res.status(200).json({ success: true, booths });
  } catch (err) {
    console.error('Get booths error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get booths assigned to the logged-in user (exhibitor)
router.get('/mine', protect, authorize('exhibitor'), async (req, res) => {
  try {
    const booths = await Booth.find({ exhibitor: req.user._id }).populate('expo', 'title startDate endDate location');
    res.status(200).json({ success: true, booths });
  } catch (err) {
    console.error('Get my booths error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reserve booth (exhibitor) - sets status to 'reserved' and records exhibitor
router.post('/:id/reserve', protect, authorize('exhibitor'), async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) return res.status(404).json({ success: false, message: 'Booth not found' });

    if (booth.status !== 'available') return res.status(400).json({ success: false, message: 'Booth not available' });

    booth.status = 'reserved';
    booth.exhibitor = req.user._id;
    booth.reservedAt = new Date();

    await booth.save();

    // Emit real-time update for booth status
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`expo_${booth.expo}`).emit('booth:update', booth);
      }
    } catch (emitErr) {
      console.error('Error emitting booth reserve event:', emitErr);
    }

    res.status(200).json({ success: true, message: 'Booth reserved', booth });
  } catch (err) {
    console.error('Reserve booth error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Assign booth (organizer/admin) - set exhibitor and status 'occupied'
router.put('/:id/assign', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { exhibitorId } = req.body;
    if (!exhibitorId) return res.status(400).json({ success: false, message: 'Please provide exhibitorId' });

    const booth = await Booth.findById(req.params.id);
    if (!booth) return res.status(404).json({ success: false, message: 'Booth not found' });

    booth.exhibitor = exhibitorId;
    booth.status = 'occupied';
    await booth.save();

    // Emit real-time update for booth assignment
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`expo_${booth.expo}`).emit('booth:update', booth);
      }
    } catch (emitErr) {
      console.error('Error emitting booth assign event:', emitErr);
    }

    res.status(200).json({ success: true, booth });
  } catch (err) {
    console.error('Assign booth error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update booth details (exhibitor can update their booth)
router.put('/:id', protect, async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) return res.status(404).json({ success: false, message: 'Booth not found' });

    if (booth.exhibitor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booth' });
    }

    const { productsServices, staff } = req.body;
    if (productsServices !== undefined) booth.productsServices = productsServices;
    if (staff !== undefined) booth.staff = staff;

    await booth.save();

    res.status(200).json({ success: true, booth });
  } catch (err) {
    console.error('Update booth error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
