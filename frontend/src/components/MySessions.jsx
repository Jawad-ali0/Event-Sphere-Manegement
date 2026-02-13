import { useEffect, useState } from 'react';
import api from '../services/api';
import './Dashboard.css';

const MySessions = () => {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/attendees/me');
        setRegs(res.data.regs || []);
      } catch (err) {
        console.error('Load my sessions error:', err);
        setError('Unable to load your sessions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const bookmark = async (expo, sessionId) => {
    try {
      await api.post('/attendees/bookmark-session', { expo, sessionId });
      // Refresh
      const res = await api.get('/attendees/me');
      setRegs(res.data.regs || []);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading sessions...</p></div>;
  if (error) return <div className="dashboard-container"><p>{error}</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Sessions</h1>
      </div>
      <div className="dashboard-content">
        {regs.length === 0 && <p>You have not registered for any expos yet.</p>}
        {regs.map(r => (
          <div key={r._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
            <h3>{r.expo?.title || 'Expo'}</h3>
            <p>Registered on: {new Date(r.registrationDate).toLocaleString()}</p>
            <h4>Bookmarked Sessions</h4>
            <ul>
              {(r.bookmarkedSessions || []).map(bs => (
                <li key={bs}>{bs}</li>
              ))}
            </ul>
            <h4>Sessions</h4>
            <ul>
              {(r.sessions || []).map(s => (
                <li key={s.session}>{s.session} <button onClick={() => bookmark(r.expo, s.session)}>Bookmark</button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySessions;
