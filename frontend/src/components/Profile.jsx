import Navbar from './Navbar';
import './Dashboard.css';

const Profile = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Profile Management features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
