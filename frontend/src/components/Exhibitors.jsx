import Navbar from './Navbar';
import './Dashboard.css';

const Exhibitors = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Exhibitor Management</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Exhibitor Management features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Exhibitors;
