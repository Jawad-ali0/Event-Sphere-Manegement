import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I register for an event?",
      answer: "To register for an event, first create an account on our platform. Then navigate to the Events section, find the event you're interested in, and click 'Register'. Follow the prompts to complete your registration. You'll receive a confirmation email with your event details."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, digital wallets, and bank transfers. During checkout, you'll see all available payment options for your location."
    },
    {
      question: "Can I cancel or refund my event ticket?",
      answer: "Cancellation policies vary by event. Most events allow cancellations up to 7 days before the event date for a full refund. Check the specific event's cancellation policy at the time of booking. Contact our support team for assistance with refunds."
    },
    {
      question: "How do I become an exhibitor?",
      answer: "To become an exhibitor, visit the Exhibitors section and complete the registration form. You'll need to provide your business information and select your booth preferences. Our team will review your application and contact you with next steps."
    },
    {
      question: "Can I modify my booth size or location after registration?",
      answer: "Yes, you can request changes to your booth within 30 days of initial registration. Contact our support team with your modification request, and we'll help you make the necessary changes based on availability."
    },
    {
      question: "What is EventSphere's cancellation policy?",
      answer: "Event cancellations are handled by individual event organizers. In case an event is canceled, you'll be notified via email. Refunds will be processed according to the event's refund policy, typically within 7-10 business days."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team via email at support@eventsphere.com, by phone at +1 (555) 123-4567, or through the Contact Us page on our website. We're available Monday-Friday, 9 AM - 6 PM (UTC)."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your personal information. All data is encrypted during transmission and storage. Please review our Privacy Policy for more details."
    },
    {
      question: "Can I view event schedules and speaker information?",
      answer: "Absolutely! Our Schedules section provides detailed event agendas, speaker information, and session details. You can search by event, date, or speaker to find what interests you."
    },
    {
      question: "Do you offer group discounts?",
      answer: "Yes, we offer group discounts for most events. Group rates typically apply for 5 or more attendees. Contact us for more information about group pricing and how to register your group."
    },
    {
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
    },
    {
      question: "Can I attend multiple events?",
      answer: "Yes, you can register for and attend as many events as you like. Your profile will keep track of all your registrations and past event attendance."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about EventSphere Management</p>
        </div>
      </section>

      <section className="faq-content">
        <div className="container">
          <div className="faq-wrapper">
            <div className="faq-intro">
              <h2>Have a Question?</h2>
              <p>
                Browse our FAQ section to find answers to your questions. If you can't find what you're looking for, 
                feel free to <Link to="/contact">contact us</Link> directly.
              </p>
            </div>

            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="question-text">{faq.question}</span>
                    <span className="faq-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`faq-answer ${activeIndex === index ? 'active' : ''}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-cta">
              <h3>Still Have Questions?</h3>
              <p>Can't find the answer you're looking for? Please contact our support team.</p>
              <Link to="/contact" className="btn-contact">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
