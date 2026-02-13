import { Link } from 'react-router-dom';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>Terms of Service</h1>
          <p>Please read our terms and conditions carefully before using our platform.</p>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="legal-document">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using EventSphere Management ("Platform"), you accept and agree to be bound by and comply with these Terms of Service. If you do not agree to these terms, please do not use this Platform.
            </p>

            <h2>2. License and Use</h2>
            <p>
              EventSphere Management grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for lawful purposes only. You agree not to:
            </p>
            <ul>
              <li>Reproduce, duplicate, or copy content without permission</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Transmit viruses or malicious code</li>
              <li>Use the Platform for illegal or unethical purposes</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              When you create an account, you agree to provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your password and account. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss resulting from unauthorized use of your account.
            </p>

            <h2>4. Event Registration and Ticketing</h2>
            <p>
              All event registrations and ticket purchases are subject to availability. EventSphere Management reserves the right to:
            </p>
            <ul>
              <li>Cancel or reschedule events</li>
              <li>Modify event details or dates</li>
              <li>Refuse or revoke registration</li>
              <li>Enforce capacity limits</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              By submitting payment information, you authorize EventSphere Management to charge your payment method for services rendered. We accept various payment methods as indicated on our Platform. All payments are non-refundable unless explicitly stated otherwise. Event cancellations may be eligible for refunds according to the event organizer's refund policy.
            </p>

            <h2>6. Intellectual Property Rights</h2>
            <p>
              The Platform and its entire contents, features, and functionality (including all information, software, text, displays, images, video, and audio) are owned by EventSphere Management, its licensors, or other providers of such material. You may not reproduce, distribute, transmit, or display any content without our written permission.
            </p>

            <h2>7. User-Generated Content</h2>
            <p>
              By submitting feedback, comments, or other content to our Platform, you grant EventSphere Management a worldwide, royalty-free, perpetual license to use, modify, and display such content. You represent that you own or have the necessary rights to the content you submit.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, EVENTSPHERE MANAGEMENT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, OR DATA, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              THE PLATFORM IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. EVENTSPHERE MANAGEMENT MAKES NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE PLATFORM OR SERVICES. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2>10. Contact Us & Support</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@eventsphere.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> EventSphere Management, 123 Event Street, Tech City, TC 12345</p>
            </div>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting to the Platform. Your continued use of the Platform following any changes constitutes your acceptance of the new terms.
            </p>

            <div className="policy-footer">
              <p className="last-updated">Last Updated: January 23, 2026</p>
              <Link to="/" className="back-link">← Back to Home</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
