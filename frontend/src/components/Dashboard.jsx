import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: 'Administrator',
      organizer: 'Organizer',
      exhibitor: 'Exhibitor',
      attendee: 'Attendee',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Welcome to EventSphere Management</h1>
      </div>

      <div className="dashboard-content">
        <div className="user-card">
          <h2>User Profile</h2>
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{getRoleDisplay(user.role)}</span>
            </div>
            {user.phone && (
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{user.phone}</span>
              </div>
            )}
            {user.companyName && (
              <div className="info-item">
                <span className="info-label">Company:</span>
                <span className="info-value">{user.companyName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-message">
          <p>You are successfully logged in as <strong>{getRoleDisplay(user.role)}</strong>.</p>
          <p>Your dashboard content will be displayed here based on your role.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
