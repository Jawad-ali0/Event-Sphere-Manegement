import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Services.css';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState(null);

  const services = useMemo(() => [
    {
      id: 1,
      name: 'Event Registration',
      icon: '📝',
      shortDescription: 'Register for events easily',
      description: 'Register for any event easily. Provide your information, get tickets, and track your attendance in sessions.',
      features: [
        'Instant Registration',
        'Email Verification',
        'Download E-Tickets',
        'View Scheduled Sessions',
        'Manage Notes'
      ],
      path: '/events'
    },
    {
      id: 2,
      name: 'Exhibitor Registration',
      icon: '🏢',
      shortDescription: 'Register your company for the expo',
      description: 'Add your company or brand to the expo. Get a booth, connect with other exhibitors, and increase your presence.',
      features: [
        'Enter Company Information',
        'Select Booths',
        'View Exhibitor List',
        'Contact Other Exhibitors',
        'Add FAQ'
      ],
      path: '/expos'
    },
    {
      id: 3,
      name: 'Booth Selection',
      icon: '🎪',
      shortDescription: 'Select your booth at the expo',
      description: 'Choose from different sizes and locations. Find the best booth for your needs and book it directly.',
      features: [
        'Interactive Booth Map',
        'View Available Booths',
        'Direct Booking',
        'Price Details',
        'Download Booth Info'
      ],
      path: '/booths'
    },
    {
      id: 4,
      name: 'Schedule & Timetable',
      icon: '📅',
      shortDescription: 'View expo schedule and timetables',
      description: 'View the complete schedule of all events, sessions, and key talks. Mark your favorite sessions and get reminders.',
      features: [
        'Schedule by Day',
        'Session Details',
        'Speaker Information',
        'Join Sessions',
        'Add to Calendar'
      ],
      path: '/schedules'
    },
    {
      id: 5,
      name: 'Find Exhibitors',
      icon: '🔍',
      shortDescription: 'Connect with other exhibitors',
      description: 'Find other traders, investors, and attendees at the expo. Connect and network with them.',
      features: [
        'Search Traders',
        'Connect with Investors',
        'View Detailed Profiles',
        'Send Messages',
        'Save Connections'
      ],
      path: '/exhibitors'
    },
    {
      id: 6,
      name: 'Messages',
      icon: '💬',
      shortDescription: 'Direct messaging with others',
      description: 'Send and receive direct messages. Ask business questions, discuss deals, and collaborate.',
      features: [
        'One-on-One Messaging',
        'Group Chat',
        'Attach Files',
        'Message History',
        'Online Status'
      ],
      path: '/messages'
    },
    {
      id: 7,
      name: 'Manage My Booth',
      icon: '⚙️',
      shortDescription: 'Manage and edit your booth',
      description: 'Keep your booth information, photos, and details organized. Update visitors and manage booth activities.',
      features: [
        'Edit Booth Details',
        'Upload Photos',
        'Booth Schedule',
        'Visitor List',
        'Reviews & Ratings'
      ],
      path: '/my-booths'
    },
    {
      id: 8,
      name: 'My Sessions',
      icon: '🎓',
      shortDescription: 'View your registered sessions',
      description: 'View all your registered sessions, seminars, and key talks in one place. Save attendance details and notes.',
      features: [
        'Session List',
        'Attendance Record',
        'Session Notes',
        'Speaker Information',
        'Download Certificate'
      ],
      path: '/my-sessions'
    }
  ], []);

  // Check URL params to open specific service
  useEffect(() => {
    const serviceId = searchParams.get('id');
    if (serviceId && services.length > 0) {
      const fullService = services.find(s => s.id === parseInt(serviceId));
      // Use setTimeout to avoid cascading renders warning
      if (fullService) {
        const timer = setTimeout(() => {
          setSelectedService(fullService);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, services]);

  const handleServiceClick = (service) => {
    if (isAuthenticated) {
      navigate(service.path);
    } else {
      navigate('/login', { state: { redirectTo: service.path } });
    }
  };

  return (
    <div className="services-page">
      <div className="services-container">
        {/* Header */}
        <div className="services-header">
          <h1>Our Services</h1>
          <p>Discover all services at EventSphere</p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p className="short-desc">{service.shortDescription}</p>
              <button
                className="service-btn"
                onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
              >
                {selectedService?.id === service.id ? 'Hide Details' : 'More Info'}
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="services-info">
          <div className="info-box">
            <div className="info-icon">🔐</div>
            <h3>Secure & Safe</h3>
            <p>All your information is kept secure and confidential</p>
          </div>
          <div className="info-box">
            <div className="info-icon">⚡</div>
            <h3>Fast & Easy</h3>
            <p>Access all services through an intuitive interface</p>
          </div>
          <div className="info-box">
            <div className="info-icon">🤝</div>
            <h3>Full Support</h3>
            <p>We are always available for any questions or issues</p>
          </div>
          <div className="info-box">
            <div className="info-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access easily from any device</p>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="services-cta">
            <h2>Get Started Now</h2>
            <p>Create your account to access all services</p>
            <div className="cta-buttons">
              <button
                className="cta-btn signup"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
              <button
                className="cta-btn login"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedService(null)}>✕</button>
            
            <div className="modal-header">
              <div className="modal-icon">{selectedService.icon}</div>
              <h2>{selectedService.name}</h2>
            </div>

            <div className="modal-content">
              <h3>Service Details:</h3>
              <p>{selectedService.description}</p>

              <h3>Features:</h3>
              <ul className="features-list">
                {selectedService.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>

              <button
                className="access-btn modal-btn"
                onClick={() => {
                  handleServiceClick(selectedService);
                  setSelectedService(null);
                }}
              >
                {isAuthenticated ? 'Access Now' : 'Login to Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
