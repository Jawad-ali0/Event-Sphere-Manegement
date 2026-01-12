import Navbar from './Navbar';
import './Dashboard.css';

const Booths = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Booth Selection</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Booth Selection features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Booths;
