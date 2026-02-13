import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [sessionPopularity, setSessionPopularity] = useState([]);
  const [boothTraffic, setBoothTraffic] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await api.get('/expos');
        setExpos(res.data.expos || []);
        if (res.data.expos && res.data.expos.length) setSelectedExpo(res.data.expos[0]._id);
      } catch (err) {
        console.error('Error fetching expos:', err);
      }
    };
    fetchExpos();
  }, []);

  const fetchAnalytics = async () => {
    if (!selectedExpo) return;
    setLoading(true);
    try {
      const [attRes, popRes, trafficRes] = await Promise.all([
        api.get(`/analytics/expo/${selectedExpo}/attendance`),
        api.get(`/analytics/expo/${selectedExpo}/session-popularity`),
        api.get(`/analytics/expo/${selectedExpo}/booth-traffic`)
      ]);

      setAttendance(attRes.data.attendance);
      setSessionPopularity(popRes.data.sessions || []);
      setBoothTraffic(trafficRes.data.booths || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedExpo]);

  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return <div className="dashboard-container"><p>You don't have permission to view analytics.</p></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <div style={{ marginBottom: 16 }}>
          <label>Select Expo</label>
          <select value={selectedExpo || ''} onChange={(e) => setSelectedExpo(e.target.value)}>
            <option value="">Select an expo</option>
            {expos.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
          </select>
        </div>

        {loading ? <p>Loading analytics...</p> : selectedExpo ? (
          <div>
            <div className="analytics-section">
              <h3>Attendance</h3>
              <p>Total Attendees: {attendance || 0}</p>
            </div>

            <div className="analytics-section">
              <h3>Session Popularity</h3>
              {sessionPopularity.length === 0 ? <p>No session data available.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Session Title</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Bookmarks</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Registrations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionPopularity.map(session => (
                      <tr key={session.sessionId}>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{session.title}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{session.bookmarks}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{session.registrations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="analytics-section">
              <h3>Booth Traffic</h3>
              {boothTraffic.length === 0 ? <p>No booth traffic data available.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Booth Number</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Visits</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Exhibitor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boothTraffic.map(booth => (
                      <tr key={booth.boothId}>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{booth.boothNumber}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{booth.visits}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{booth.exhibitor ? `${booth.exhibitor.firstName} ${booth.exhibitor.lastName}` : 'Unassigned'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : <p>Please select an expo to view analytics.</p>}
      </div>
    </div>
  );
};

export default Analytics;
