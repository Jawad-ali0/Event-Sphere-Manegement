import Navbar from './Navbar';
import './Dashboard.css';

const Events = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Events</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Events features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Events;
