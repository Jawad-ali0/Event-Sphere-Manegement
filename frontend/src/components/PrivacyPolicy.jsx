import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. Read our complete privacy policy.</p>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="legal-document">
            <h2>1. Introduction</h2>
            <p>
              Welcome to EventSphere Management ("we," "us," "our," or "Company"). EventSphere Management is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and mailing address that you voluntarily give to us when you register with the Site</li>
              <li><strong>Payment Information:</strong> Billing information, payment method, and transaction history</li>
              <li><strong>Device Information:</strong> Device type, IP address, operating system, and browser type</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and search queries</li>
              <li><strong>Cookies:</strong> Identifiers and similar tracking technologies</li>
            </ul>

            <h2>3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Process your transactions and send related information</li>
              <li>Deliver targeted advertising, promotional materials, and offers</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may share your information with third parties in certain circumstances, including:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> We may share information with vendors, contractors, and service providers who assist us in operating our website and conducting our business</li>
              <li><strong>Business Transfers:</strong> Your information may be transferred as part of any merger, sale of company assets, bankruptcy, or other business transaction</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law or when we believe in good faith that disclosure is necessary</li>
              <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
            </ul>

            <h2>5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security of your information.
            </p>

            <h2>6. Contact Us & Support</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@eventsphere.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> EventSphere Management, 123 Event Street, Tech City, TC 12345</p>
            </div>

            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The "Last Updated" date at the bottom of this policy indicates when it was last revised.
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

export default PrivacyPolicy;
