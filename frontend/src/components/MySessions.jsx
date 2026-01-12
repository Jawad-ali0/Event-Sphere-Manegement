import Navbar from './Navbar';
import './Dashboard.css';

const MySessions = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>My Sessions</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>My Sessions features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default MySessions;
