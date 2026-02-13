import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation menu structure
  const navigationMenu = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/schedules', label: 'Schedule' },
    { path: '/exhibitors', label: 'Speakers' },
    { path: '/services', label: 'Venue' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - show only when not authenticated */}
        {!isAuthenticated && (
          <Link to="/" className="navbar-logo" title="Event Sphere" aria-label="Event Sphere">
            Event Sphere
          </Link>
        )}

        {/* Desktop Navigation Menu - Centered */}
        <div className="navbar-menu-center">
          {navigationMenu.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated && user && user.role === 'admin' && (
            <Link to="/admin" className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link>
          )}

          {isAuthenticated && user && user.role === 'organizer' && (
            <>
              <Link to="/events" title="Events" aria-label="Events" className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`}>Events</Link>
              <Link to="/booths" title="Booths" aria-label="Booths" className={`navbar-link ${location.pathname === '/booths' ? 'active' : ''}`}>Booths</Link>
              <Link to="/analytics" title="Analytics" aria-label="Analytics" className={`navbar-link ${location.pathname === '/analytics' ? 'active' : ''}`}>Analytics</Link>
              <Link to="/schedule-management" title="Schedule Management" aria-label="Schedule Management" className={`navbar-link ${location.pathname === '/schedule-management' ? 'active' : ''}`}>Schedule Management</Link>
            </>
          )}

          {isAuthenticated && user && user.role === 'exhibitor' && (
            <>
              <Link to="/exhibitor-register" title="Exhibitor Registration" aria-label="Exhibitor Registration" className={`navbar-link ${location.pathname === '/exhibitor-register' ? 'active' : ''}`}>Exhibitor</Link>
              <Link to="/my-booths" title="My Booths" aria-label="My Booths" className={`navbar-link ${location.pathname === '/my-booths' ? 'active' : ''}`}>My Booths</Link>
              <Link to="/feedback" title="Feedback" aria-label="Feedback" className={`navbar-link ${location.pathname === '/feedback' ? 'active' : ''}`}>Feedback</Link>
            </>
          )}

          {isAuthenticated && user && user.role === 'attendee' && (
            <>
              <Link to="/events" title="Events" aria-label="Events" className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`}>Events</Link>
              <Link to="/expos" title="Expos" aria-label="Expos" className={`navbar-link ${location.pathname === '/expos' ? 'active' : ''}`}>Expos</Link>
              <Link to="/my-sessions" title="My Sessions" aria-label="My Sessions" className={`navbar-link ${location.pathname === '/my-sessions' ? 'active' : ''}`}>My Sessions</Link>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <>
              <div className="navbar-user-info">
                <span className="user-name" title={`${user.firstName} ${user.lastName || ''}`}>{user.firstName}</span>
                
              </div>

              <button 
                onClick={handleLogout}
                className="btn-logout"
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link-auth" title="Login">
                Login
              </Link>
              <Link to="/signup" className="btn-buy-tickets" title="Sign Up">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
