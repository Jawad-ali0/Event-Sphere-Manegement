const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect, authorize } = require('../middleware/auth');

// Send message (exhibitor or organizer/admin)
router.post('/', protect, async (req, res) => {
  try {
    const { expo, recipient, subject, content, messageType } = req.body;

    if (!expo || !recipient || !subject || !content || !messageType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate message type based on user role
    if (req.user.role === 'exhibitor' && !['exhibitor-to-organizer', 'exhibitor-to-exhibitor'].includes(messageType)) {
      return res.status(400).json({ success: false, message: 'Invalid message type for exhibitor' });
    }

    if ((req.user.role === 'organizer' || req.user.role === 'admin') && messageType !== 'organizer-to-exhibitor') {
      return res.status(400).json({ success: false, message: 'Invalid message type for organizer/admin' });
    }

    const message = await Message.create({
      expo,
      sender: req.user._id,
      recipient,
      subject,
      content,
      messageType,
    });

    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get messages for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    }).populate('sender', 'firstName lastName email').populate('recipient', 'firstName lastName email').populate('expo', 'title').sort({ createdAt: -1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete message (only sender can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only sender can delete message' });
    }

    await message.remove();

    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
