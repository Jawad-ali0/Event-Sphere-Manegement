import Navbar from './Navbar';
import './Dashboard.css';

const Feedback = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Feedback & Support</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Feedback & Support features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
