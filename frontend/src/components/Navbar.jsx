import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

// Roman-Urdu: Navbar component - simple, samajhne mein aasan aur accessible
// Yahan `ThemeToggle` add kia gaya hai jo dark/light mode switch karta hai.

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Admin/Organizer Menu Items
  const adminMenuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/expos', label: 'Expo Management' },
    { path: '/exhibitors', label: 'Exhibitor Management' },
    { path: '/schedules', label: 'Schedule Management' },
    { path: '/analytics', label: 'Analytics & Reports' },
  ];

  // Exhibitor Menu Items
  const exhibitorMenuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/expos', label: 'Register for Expo' },
    { path: '/profile', label: 'My Profile' },
    { path: '/booths', label: 'Booth Selection' },
    { path: '/my-booths', label: 'My Booths' },
    { path: '/messages', label: 'Messages' },
  ];

  // Attendee Menu Items
  const attendeeMenuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Events' },
    { path: '/exhibitors', label: 'Exhibitor Search' },
    { path: '/schedules', label: 'Schedule' },
    { path: '/my-sessions', label: 'My Sessions' },
    { path: '/messages', label: 'Messages' },
  ];

  // General Menu Items (for all authenticated users)
  const generalMenuItems = [
    { path: '/feedback', label: 'Feedback & Support' },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    
    const role = user.role;
    let items = [];

    if (role === 'admin' || role === 'organizer') {
      items = [...adminMenuItems];
    } else if (role === 'exhibitor') {
      items = [...exhibitorMenuItems];
    } else if (role === 'attendee') {
      items = [...attendeeMenuItems];
    }

    return [...items, ...generalMenuItems];
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventSphere
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              {/* Desktop Menu */}
              <div className="navbar-desktop-menu">
                {getMenuItems().map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="navbar-link"
                    onClick={closeDropdown}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="navbar-mobile-toggle"
                onClick={() => toggleDropdown('mobile')}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              {/* Mobile Dropdown */}
              {activeDropdown === 'mobile' && (
                <div className="navbar-mobile-menu">
                  {getMenuItems().map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="navbar-mobile-link"
                      onClick={closeDropdown}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="navbar-user">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role">({user?.role})</span>
              </div>
              <ThemeToggle />
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/login" className="navbar-link">Login</Link>
              <ThemeToggle />
              <Link to="/signup" className="navbar-button">
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
