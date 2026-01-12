import Navbar from './Navbar';
import './Dashboard.css';

const MyBooths = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>My Booths</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>My Booths features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default MyBooths;
