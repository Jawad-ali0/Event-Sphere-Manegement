import { useEffect, useState } from 'react';
import api from '../services/api';
import './Dashboard.css';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';

const MyBooths = () => {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useSocket();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const loadBooths = async () => {
      try {
        const res = await api.get('/booths/mine');
        setBooths(res.data.booths || []);
      } catch (err) {
        console.error('Error loading my booths:', err);
        setError('Unable to load your booths');
      } finally {
        setLoading(false);
      }
    };

    loadBooths();
  }, []);

  // Listen for registration updates for this user and refresh my booths / show toast
  useEffect(() => {
    if (!socket || !user) return;

    const handler = (payload) => {
      if (!payload || !payload.registration) return;
      const reg = payload.registration;
      const regExhibitor = reg.exhibitor?._id ? reg.exhibitor._id : reg.exhibitor;
      if (regExhibitor && regExhibitor.toString() === user._id.toString()) {
        const boothNumber = payload.booth?.boothNumber || '';
        showToast({ message: `Your registration was approved. Booth ${boothNumber} has been assigned.`, type: 'success' });
        setLoading(true);
        api.get('/booths/mine').then(res => setBooths(res.data.booths || [])).catch(() => {}).finally(() => setLoading(false));
      }
    };

    socket.on('registration:update', handler);
    return () => socket.off('registration:update', handler);
  }, [socket, user, showToast]);

  if (loading) return <div className="dashboard-container"><p>Loading your booths...</p></div>;
  if (error) return <div className="dashboard-container"><p>{error}</p></div>;

  if (!booths || booths.length === 0) return (
    <div className="dashboard-container">
      <div className="dashboard-header"><h1>My Booths</h1></div>
      <div className="dashboard-content">
        <p>You currently have no booths assigned. Once an organizer assigns a booth to you, it will appear here.</p>
        <div style={{ marginTop: 16 }}>
          <a href="/booths" className="request-btn">Browse Available Booths</a>
        </div>
      </div>
    </div>
  );
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Booths</h1>
      </div>
      <div className="dashboard-content">
        {booths.length === 0 ? (
          <div className="dashboard-message">You currently have no assigned booths. Once a booth is assigned by an organizer, it will appear here.</div>
        ) : (
          <div className="booths-grid">
            {booths.map((b) => (
              <div key={b._id} className="booth-card">
                <h4>Booth {b.boothNumber}</h4>
                <p>Expo: {b.expo?.title || '—'}</p>
                <p>Location: {b.location?.section || '—'} ({b.location?.x || 'x'}, {b.location?.y || 'y'})</p>
                <p>Price: ${b.price}</p>
                <p>Status: {b.status}</p>
                {b.reservedAt && <p>Reserved at: {new Date(b.reservedAt).toLocaleString()}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooths;
