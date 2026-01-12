import Navbar from './Navbar';
import './Dashboard.css';

const Analytics = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Analytics & Reports</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Analytics & Reports features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
