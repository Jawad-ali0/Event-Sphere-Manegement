const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ExhibitorRegistration = require('../models/ExhibitorRegistration');
const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const { protect, authorize } = require('../middleware/auth');

// Submit exhibitor registration (exhibitor)
router.post('/register', [
  protect,
  authorize('exhibitor'),
  check('expo').isMongoId().withMessage('Invalid expo id'),
  check('companyName').notEmpty().withMessage('Company name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { expo, companyName, companyDescription, productsServices, documents, logo, contactInfo } = req.body;

    const expoObj = await Expo.findById(expo);
    if (!expoObj) return res.status(404).json({ success: false, message: 'Expo not found' });

    // Prevent duplicate registration
    const existing = await ExhibitorRegistration.findOne({ expo, exhibitor: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered for this expo' });

    const registration = await ExhibitorRegistration.create({
      expo,
      exhibitor: req.user._id,
      companyName,
      companyDescription,
      productsServices: productsServices || [],
      documents: documents || [],
      logo: logo || '',
      contactInfo: contactInfo || {},
      status: 'pending',
    });

    res.status(201).json({ success: true, registration });
  } catch (err) {
    console.error('Exhibitor register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Organizer/Admin: view registrations for an expo
router.get('/expo/:expoId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const regs = await ExhibitorRegistration.find({ expo: req.params.expoId }).populate('exhibitor', 'firstName lastName email companyName');
    res.status(200).json({ success: true, regs });
  } catch (err) {
    console.error('Get exhibitor regs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Approve / reject registration (organizer/admin)
router.put('/:id/status', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['approved', 'rejected', 'pending', 'cancelled'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status value' });

    const reg = await ExhibitorRegistration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    reg.status = status;
    reg.notes = notes || reg.notes;
    reg.reviewedBy = req.user._id;
    reg.reviewedAt = new Date();

    await reg.save();

    res.status(200).json({ success: true, reg });
  } catch (err) {
    console.error('Update registraton status error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Assign booth to registration (organizer/admin)
router.put('/:id/assign-booth', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { boothId } = req.body;
    if (!boothId) return res.status(400).json({ success: false, message: 'Please provide boothId' });

    const reg = await ExhibitorRegistration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    const booth = await Booth.findById(boothId);
    if (!booth) return res.status(404).json({ success: false, message: 'Booth not found' });

    if (booth.status !== 'available' && booth.exhibitor && booth.exhibitor.toString() !== reg.exhibitor.toString()) {
      return res.status(400).json({ success: false, message: 'Booth not available' });
    }

    // Assign
    booth.exhibitor = reg.exhibitor;
    booth.status = 'occupied';
    await booth.save();

    reg.booth = booth._id;
    reg.status = 'approved';
    reg.reviewedBy = req.user._id;
    reg.reviewedAt = new Date();
    await reg.save();

    // Emit registration update (to expo room and the specific exhibitor)
    try {
      const io = req.app.get('io');
      const payload = { action: 'assigned', registration: reg, booth };
      if (io) {
        io.to(`expo_${reg.expo}`).emit('registration:update', payload);
        io.to(`user_${reg.exhibitor}`).emit('registration:update', payload);
      }
    } catch (emitErr) {
      console.error('Error emitting registration update:', emitErr);
    }

    res.status(200).json({ success: true, reg, booth });
  } catch (err) {
    console.error('Assign booth to registration error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get exhibitor registrations for logged-in user
router.get('/my-registrations', protect, authorize('exhibitor'), async (req, res) => {
  try {
    const regs = await ExhibitorRegistration.find({ exhibitor: req.user._id }).populate('expo', 'title startDate endDate location').populate('booth');
    res.status(200).json({ success: true, registrations: regs });
  } catch (err) {
    console.error('Get my registrations error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update exhibitor profile/registration
router.put('/registration/:id', protect, authorize('exhibitor'), async (req, res) => {
  try {
    const reg = await ExhibitorRegistration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    if (reg.exhibitor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this registration' });
    }

    const { companyName, companyDescription, productsServices, logo, contactInfo, staff } = req.body;

    if (companyName) reg.companyName = companyName;
    if (companyDescription !== undefined) reg.companyDescription = companyDescription;
    if (productsServices) reg.productsServices = productsServices;
    if (logo !== undefined) reg.logo = logo;
    if (contactInfo) reg.contactInfo = contactInfo;
    if (staff) reg.staff = staff;

    await reg.save();

    res.status(200).json({ success: true, registration: reg });
  } catch (err) {
    console.error('Update registration error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Search exhibitors
router.get('/search', async (req, res) => {
  try {
    const { expo, category, search } = req.query;
    let query = { status: 'approved' };

    if (expo) query.expo = expo;

    const exhibitors = await ExhibitorRegistration.find(query)
      .populate('exhibitor', 'firstName lastName email')
      .populate('booth')
      .populate('expo', 'title startDate endDate location');

    let filtered = exhibitors;

    if (category) {
      filtered = filtered.filter(e => e.productsServices && e.productsServices.includes(category));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(e =>
        e.companyName.toLowerCase().includes(searchLower) ||
        e.companyDescription.toLowerCase().includes(searchLower) ||
        (e.productsServices && e.productsServices.some(p => p.toLowerCase().includes(searchLower)))
      );
    }

    res.status(200).json({ success: true, exhibitors: filtered });
  } catch (err) {
    console.error('Search exhibitors error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get exhibitor profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const exhibitor = await ExhibitorRegistration.findById(req.params.id)
      .populate('exhibitor', 'firstName lastName email')
      .populate('booth')
      .populate('expo', 'title startDate endDate location');

    if (!exhibitor) return res.status(404).json({ success: false, message: 'Exhibitor not found' });

    res.status(200).json({ success: true, exhibitor });
  } catch (err) {
    console.error('Get exhibitor profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
