import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer" className="footer position-relative light-background">
      <div className="container footer-top">
        <div className="row gy-4">
          {/* About Section */}
          <div className="col-lg-4 col-md-6 footer-about">
            <Link to="/" className="logo d-flex align-items-center">
              <span className="sitename">EventSphere</span>
            </Link>
            <div className="footer-contact pt-3">
              <p>Event Management Platform</p>
              <p>Making Events Memorable & Easy</p>
              <p className="mt-3">
                <strong>Phone:</strong> <span>+1 (555) 123-4567</span>
              </p>
              <p>
                <strong>Email:</strong> <span>info@eventsphere.com</span>
              </p>
            </div>
            <div className="social-links d-flex mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Navigation</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Events & Exhibitors */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Events</h4>
            <ul>
              <li>
                <Link to="/schedules">Schedule</Link>
              </li>
              <li>
                <Link to="/exhibitors">Exhibitors</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/contact">Register Now</Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Account</h4>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/contact">Support</Link>
              </li>
              <li>
                <Link to="/services">Our Services</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Get in Touch</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container copyright text-center mt-4">
        <p>
          © <span>Copyright</span>{' '}
          <strong className="px-1 sitename">EventSphere</strong>{' '}
          <span>All Rights Reserved</span>
        </p>
        <div className="credits">
          <p>
            Made with <span className="heart">❤️</span> for Event Management Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
