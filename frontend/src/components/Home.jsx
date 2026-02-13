// Roman-Urdu: Home.jsx - Aasaan samajh ke liye comments
// Hero, Event Details, Features, Services, Testimonials yahan define hain
import { Link } from 'react-router-dom';
import EventCarousel from './EventCarousel';
import TestimonialsCarousel from './TestimonialsCarousel';
import './Home.css';

const Home = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Expo 2026',
      date: 'March 15-17, 2026',
      location: 'Convention Center, Dubai',
      attendees: '5,000+',
      icon: 'bi-rocket-takeoff'
    },
    {
      id: 2,
      title: 'Business Summit',
      date: 'April 10-12, 2026',
      location: 'Grand Hall, Singapore',
      attendees: '3,000+',
      icon: 'bi-briefcase'
    },
    {
      id: 3,
      title: 'Digital Marketing Conf',
      date: 'May 5-7, 2026',
      location: 'Tech Hub, Bangalore',
      attendees: '2,000+',
      icon: 'bi-phone'
    }
  ];

  const features = [
    {
      icon: 'bi-lightbulb',
      title: 'Innovation Focus',
      description: 'Explore cutting-edge technologies and breakthrough solutions that are reshaping industries worldwide.'
    },
    {
      icon: 'bi-trophy',
      title: 'Expert Speakers',
      description: 'Learn from industry leaders, successful entrepreneurs, and visionary thinkers who are driving change.'
    },
    {
      icon: 'bi-rocket-takeoff',
      title: 'Career Growth',
      description: 'Accelerate your professional development through workshops, mentorship, and networking opportunities.'
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Business Insights',
      description: 'Gain valuable market intelligence and strategic insights to drive your business forward.'
    },
    {
      icon: 'bi-puzzle',
      title: 'Hands-on Workshops',
      description: 'Participate in interactive sessions and practical workshops to develop new skills and knowledge.'
    },
    {
      icon: 'bi-globe2',
      title: 'Global Community',
      description: 'Join a diverse community of innovators, creators, and change-makers from around the world.'
    }
  ];

  const stats = [
    { number: '3', label: 'Days of Events' },
    { number: '50+', label: 'Expert Speakers' },
    { number: '2000+', label: 'Attendees' },
    { number: '100+', label: 'Sessions' }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">EventSphere Management 2026</h1>
            <p className="hero-subtitle">Shaping the Future of Innovation</p>
            <p className="hero-description">
              Join industry leaders, innovators, and visionaries for groundbreaking discussions, networking opportunities, and transformative insights that will define the next decade of event management.
            </p>

            <div className="event-details-cards">
              {upcomingEvents.slice(0, 1).map((event) => (
                <div key={event.id} className="detail-card">
                  <i className={`bi ${event.icon}`}></i>
                  <div>
                    <span className="detail-label">Featured Event</span>
                    <span className="detail-value">{event.date}</span>
                    <span className="detail-location">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Register Now
              </Link>
              <Link to="/schedules" className="btn btn-outline btn-lg">
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Event Carousel */}
      <div className="carousel-wrapper">
        <EventCarousel />
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Why Choose EventSphere?</h2>
            <p>Comprehensive platform for event management and networking</p>
          </div>

          <div className="features-grid">
            <div className="row g-4">
              {features.map((feature, index) => (
                <div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={200 + index * 50}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className={`bi ${feature.icon}`}></i>
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-wrapper cta-center" data-aos="fade-up">
            <div className="cta-content-center">
              <h2>Ready to Transform Your Event Experience?</h2>
              <p>Join thousands of forward-thinking professionals at the most innovative event management platform of the year. Discover cutting-edge solutions, network with industry leaders, and accelerate your career.</p>
              
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary">Get Your Tickets</Link>
                <Link to="/events" className="btn btn-outline">View Agenda</Link>
              </div>

              <div className="trust-indicators">
                <div className="trust-item">
                  <i className="bi bi-shield-check"></i>
                  <span>Secure Registration</span>
                </div>
                <div className="trust-item">
                  <i className="bi bi-lightning"></i>
                  <span>Instant Confirmation</span>
                </div>
                <div className="trust-item">
                  <i className="bi bi-calendar-event"></i>
                  <span>Flexible Cancellation</span>
                </div>
              </div>
            </div>

            <div className="cta-stats-center">
              <div className="cta-stat-card">
                <div className="stat-content">
                  <span className="stat-percent">89%</span>
                  <span className="stat-text">Would Recommend</span>
                </div>
              </div>
              <div className="cta-stat-card">
                <div className="stat-content">
                  <span className="stat-percent">4.9/5</span>
                  <span className="stat-text">Average Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel />
    </div>
  );
};

export default Home;
