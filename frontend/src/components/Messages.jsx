import Navbar from './Navbar';
import './Dashboard.css';

const Messages = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Messages</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-message">
          <p>Messaging features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
