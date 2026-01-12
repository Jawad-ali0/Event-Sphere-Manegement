import Navbar from './Navbar';
import './Dashboard.css';

const Schedules = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Schedule Management</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Schedule Management features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
