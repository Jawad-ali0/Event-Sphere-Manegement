const express = require('express');
const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get contact message template
const getContactEmailTemplate = (contactData) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">New Contact Form Submission</h1>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0; color: #666;"><strong>Name:</strong> ${contactData.name}</p>
          <p style="margin: 8px 0 0 0; color: #666;"><strong>Email:</strong> ${contactData.email}</p>
          ${contactData.phone ? `<p style="margin: 8px 0 0 0; color: #666;"><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0; color: #666;"><strong>Subject:</strong> ${contactData.subject}</p>
          <p style="margin: 8px 0 0 0; color: #666;"><strong>Type:</strong> ${contactData.feedbackType || 'general'}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
          <h3 style="margin: 0 0 10px 0; color: #667eea;">Message:</h3>
          <p style="margin: 0; color: #333; white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0;">Submitted on ${new Date(contactData.createdAt).toLocaleString()}</p>
          <p style="margin: 8px 0 0 0;">EventSphere Management System</p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
NEW CONTACT FORM SUBMISSION

Contact Details:
Name: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}

Subject: ${contactData.subject}
Type: ${contactData.feedbackType || 'general'}

Message:
${contactData.message}

Submitted on: ${new Date(contactData.createdAt).toLocaleString()}
EventSphere Management System
  `;

  return { htmlContent, textContent };
};

// @route   POST /api/contact/submit
// @desc    Submit a contact form
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message, feedbackType } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message',
      });
    }

    // Create new contact submission
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      feedbackType: feedbackType || 'general',
    });

    // Send email to admin
    try {
      const { htmlContent, textContent } = getContactEmailTemplate(contact);
      
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@eventsphere.com';
      
      await sendEmail({
        email: adminEmail,
        subject: `New Contact Form: ${subject}`,
        htmlContent,
        textContent,
      });
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Us</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${name},</p>
            
            <p style="color: #666; line-height: 1.6; margin: 20px 0;">
              Thank you for reaching out to EventSphere Management. We have received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 0; color: #667eea;"><strong>Your Reference:</strong> ${contact._id}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin: 20px 0;">
              If you have any urgent matters, please feel free to call us or contact our support team directly.
            </p>
            
            <p style="color: #666; margin: 20px 0;">
              Best regards,<br/>
              <strong>EventSphere Management Team</strong>
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        email,
        subject: 'We received your message - EventSphere Management',
        htmlContent: confirmationHtml,
        textContent: `Thank you for contacting us. We received your message and will get back to you soon. Your reference: ${contact._id}`,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully. We will get back to you soon.',
      data: contact,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form. Please try again.',
      error: error.message,
    });
  }
});

// @route   GET /api/contact/all
// @desc    Get all contact submissions (Admin only)
// @access  Private/Admin
router.get('/all', protect, async (req, res) => {
  try {
    const user = req.user;

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact submission
// @access  Private/Admin
router.get('/:id', protect, async (req, res) => {
  try {
    const user = req.user;

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { readAt: new Date(), status: 'read' },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message,
    });
  }
});

// @route   PUT /api/contact/:id/reply
// @desc    Reply to contact submission
// @access  Private/Admin
router.put('/:id/reply', protect, async (req, res) => {
  try {
    const user = req.user;

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    const { adminReply } = req.body;

    if (!adminReply) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reply',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        adminReply,
        status: 'replied',
        repliedAt: new Date(),
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Send reply email to user
    try {
      const replyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Response to Your Inquiry</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Dear ${contact.name},</p>
            
            <p style="color: #666; line-height: 1.6; margin: 20px 0;">
              Thank you for your inquiry regarding "<strong>${contact.subject}</strong>". Here is our response:
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 0; color: #333; white-space: pre-wrap; line-height: 1.6;">${adminReply}</p>
            </div>
            
            <p style="color: #666; margin: 20px 0;">
              If you have any further questions, please don't hesitate to contact us again.
            </p>
            
            <p style="color: #666; margin: 20px 0;">
              Best regards,<br/>
              <strong>EventSphere Management Team</strong>
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        email: contact.email,
        subject: `Re: ${contact.subject} - EventSphere Management`,
        htmlContent: replyHtml,
        textContent: `Response to your inquiry:\n\n${adminReply}`,
      });
    } catch (emailError) {
      console.error('Error sending reply email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reply',
      error: error.message,
    });
  }
});

// @route   GET /api/contact/recent/feedback
// @desc    Get recent feedback for homepage display
// @access  Public
router.get('/recent/feedback', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const contacts = await Contact.find({ status: { $in: ['new', 'read', 'replied', 'resolved'] } })
      .select('name email subject message createdAt rating feedbackType')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Get recent feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message,
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact submission
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = req.user;

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message,
    });
  }
});

module.exports = router;
