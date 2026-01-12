// Roman-Urdu: Home.jsx - Aasaan samajh ke liye comments
// Hero, Carousel, Services yahan define hain. Simple components use kar ke banaaya gaya.
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import EventCarousel from './EventCarousel';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            EVENT PLANNER<br />
            MARKETING ENTHUSIASTS
          </h1>
          <h2 className="hero-subtitle">EVENTSPHERE MANAGEMENT</h2>
          <p className="hero-description">
            Revolutionizing expo and trade show management with cutting-edge technology
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Event Carousel */}
      <EventCarousel />

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">A RANGE OF SERVICES</h2>
          <p className="section-subtitle">ADAPTED TO YOUR NEEDS</p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎪</div>
              <h3>Expo Management</h3>
              <p>Complete expo and trade show management solutions for organizers, exhibitors, and attendees.</p>
              <Link to="/signup" className="service-link">View Details →</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">🏢</div>
              <h3>Corporate Events</h3>
              <p>Professional event planning services for corporate sectors with real-time management tools.</p>
              <Link to="/signup" className="service-link">View Details →</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>Schedule Management</h3>
              <p>Efficient schedule creation, session management, and real-time updates for seamless events.</p>
              <Link to="/signup" className="service-link">View Details →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose EventSphere?</h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h4>Real-Time Updates</h4>
              <p>Get instant updates on schedules, booth allocations, and event changes.</p>
            </div>

            <div className="feature-item">
              <div className="feature-number">02</div>
              <h4>Easy Registration</h4>
              <p>Simple and secure registration process for organizers, exhibitors, and attendees.</p>
            </div>

            <div className="feature-item">
              <div className="feature-number">03</div>
              <h4>Booth Management</h4>
              <p>Visual floor plans and easy booth selection for exhibitors.</p>
            </div>

            <div className="feature-item">
              <div className="feature-number">04</div>
              <h4>Analytics & Reports</h4>
              <p>Comprehensive analytics and reporting for event performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Events?</h2>
          <p>Join EventSphere Management and experience the future of event management</p>
          <Link to="/signup" className="btn btn-primary btn-large">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
