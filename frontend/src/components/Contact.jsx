import { useState } from 'react';
import './Contact.css';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/contact/submit', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit contact form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 data-aos="fade-down">Contact Us</h1>
          <p data-aos="fade-up" data-aos-delay="200">We'd love to hear from you. Send us a message!</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info" data-aos="fade-right">
              <h2>Get in Touch</h2>
              <p>Have questions or feedback? We're here to help!</p>
              
              <div className="info-item" data-aos="fade-up" data-aos-delay="100">
                <div className="info-icon"><i className="bi bi-envelope-open"></i></div>
                <h4>Email</h4>
                <p>support@eventsphere.com</p>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="150">
                <div className="info-icon"><i className="bi bi-telephone"></i></div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="200">
                <div className="info-icon"><i className="bi bi-geo-alt"></i></div>
                <h4>Address</h4>
                <p>EventSphere Management<br/>123 Event Street<br/>New York, NY 10001</p>
              </div>

              <div className="info-item" data-aos="fade-up" data-aos-delay="250">
                <div className="info-icon"><i className="bi bi-clock"></i></div>
                <h4>Business Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper" data-aos="fade-left">
              <h2>Send us a Message</h2>
              
              {success && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle"></i>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              {error && (
                <div className="alert alert-error">
                  <i className="bi bi-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Your message here..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="bi bi-hourglass-split"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" data-aos="fade-up">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item" data-aos="fade-up" data-aos-delay="100">
              <h4><i className="bi bi-question-circle"></i> How quickly will I get a response?</h4>
              <p>We aim to respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className="faq-item" data-aos="fade-up" data-aos-delay="150">
              <h4><i className="bi bi-question-circle"></i> Do you offer technical support?</h4>
              <p>Yes, our technical support team is available to assist you with any issues.</p>
            </div>
            <div className="faq-item" data-aos="fade-up" data-aos-delay="200">
              <h4><i className="bi bi-question-circle"></i> Can I schedule a demo?</h4>
              <p>Absolutely! Contact us and we'll schedule a personalized demo for you.</p>
            </div>
            <div className="faq-item" data-aos="fade-up" data-aos-delay="250">
              <h4><i className="bi bi-question-circle"></i> What payment methods do you accept?</h4>
              <p>We accept all major credit cards, bank transfers, and online payment methods.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
