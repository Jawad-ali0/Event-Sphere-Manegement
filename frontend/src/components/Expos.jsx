import Navbar from './Navbar';
import './Dashboard.css';

const Expos = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Expo Management</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Expo Management features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Expos;
