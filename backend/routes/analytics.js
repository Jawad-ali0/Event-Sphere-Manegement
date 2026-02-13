const express = require('express');
const router = express.Router();
const AttendeeRegistration = require('../models/AttendeeRegistration');
const Schedule = require('../models/Schedule');
const Booth = require('../models/Booth');
const mongoose = require('mongoose');

// Get attendance count for an expo
// GET /api/analytics/expo/:expoId/attendance
router.get('/expo/:expoId/attendance', async (req, res) => {
  try {
    const expoId = req.params.expoId;

    const count = await AttendeeRegistration.countDocuments({ expo: expoId });

    res.status(200).json({ success: true, expo: expoId, attendance: count });
  } catch (err) {
    console.error('Attendance analytics error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get session popularity for an expo
// Returns counts of bookmarks and registrations per session
// GET /api/analytics/expo/:expoId/session-popularity
router.get('/expo/:expoId/session-popularity', async (req, res) => {
  try {
    const expoId = req.params.expoId;

    // Find schedule for expo
    const schedule = await Schedule.findOne({ expo: expoId });
    if (!schedule) return res.status(200).json({ success: true, sessions: [] });

    // Prepare map of session ids
    const sessionIds = schedule.sessions.map(s => s._id.toString());

    // Count bookmarks across attendee registrations
    const bookmarkAgg = await AttendeeRegistration.aggregate([
      { $match: { expo: schedule.expo } },
      { $unwind: { path: '$bookmarkedSessions', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$bookmarkedSessions', bookmarks: { $sum: 1 } } }
    ]);

    // Count session registrations (attendee sessions array)
    const sessionRegAgg = await AttendeeRegistration.aggregate([
      { $match: { expo: schedule.expo } },
      { $unwind: { path: '$sessions', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$sessions.session', registrations: { $sum: 1 } } }
    ]);

    const popularity = schedule.sessions.map((s) => {
      const id = s._id.toString();
      const bookmarks = bookmarkAgg.find(b => b._id && b._id.toString() === id)?.bookmarks || 0;
      const registrations = sessionRegAgg.find(r => r._id && r._id.toString() === id)?.registrations || 0;
      return {
        sessionId: id,
        title: s.title,
        bookmarks,
        registrations,
      };
    });

    res.status(200).json({ success: true, sessions: popularity });
  } catch (err) {
    console.error('Session popularity analytics error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get booth traffic for an expo (visits per booth)
// GET /api/analytics/expo/:expoId/booth-traffic
router.get('/expo/:expoId/booth-traffic', async (req, res) => {
  try {
    const expoId = req.params.expoId;

    // Aggregate visitedBooths across attendee registrations
    const agg = await AttendeeRegistration.aggregate([
      { $match: { expo: require('mongoose').Types.ObjectId(expoId) } },
      { $unwind: { path: '$visitedBooths', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$visitedBooths.booth', visits: { $sum: 1 } } },
      { $lookup: { from: 'booths', localField: '_id', foreignField: '_id', as: 'booth' } },
      { $unwind: { path: '$booth', preserveNullAndEmptyArrays: true } },
      { $project: { boothId: '$_id', visits: 1, boothNumber: '$booth.boothNumber', exhibitor: '$booth.exhibitor' } },
      { $sort: { visits: -1 } }
    ]);

    res.status(200).json({ success: true, booths: agg });
  } catch (err) {
    console.error('Booth traffic analytics error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
