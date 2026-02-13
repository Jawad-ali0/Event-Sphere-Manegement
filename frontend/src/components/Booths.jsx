import './Dashboard.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CreateExpoModal from './CreateExpoModal';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Booths = () => {
  const [expoId, setExpoId] = useState(null);
  const [booths, setBooths] = useState([]);
  const [expos, setExpos] = useState([]);
  const [exposLoading, setExposLoading] = useState(false);
  const [exposError, setExposError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingId, setReservingId] = useState(null);

  const { socket, joinExpo } = useSocket();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchExpos = async () => {
    setExposLoading(true);
    setExposError(null);
    try {
      const res = await api.get('/expos');
      const expoList = res.data.expos || [];
      setExpos(expoList);
      if (expoList.length) {
        setExpoId(prev => prev || expoList[0]._id);
      } else {
        setExpoId(null);
        setBooths([]);
      }
    } catch (err) {
      console.error('Error fetching expos:', err);
      setExpos([]);
      setExpoId(null);
      setBooths([]);
      setExposError('Unable to load expos');
    } finally {
      setExposLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  useEffect(() => {
    if (!expoId) return;

    const fetchBooths = async () => {
      setLoading(true);
      setError(null);
      try {
        const boothsRes = await api.get(`/booths/expo/${expoId}`);
        setBooths(boothsRes.data.booths || []);

        // Join socket room for real-time updates
        joinExpo(expoId);
      } catch (err) {
        console.error('Error fetching booths:', err);
        setError('Unable to fetch booths for selected expo');
        setBooths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooths();
  }, [expoId]);

  const requestBooth = async (boothId) => {
    if (!user || user.role !== 'exhibitor') {
      alert('Only exhibitor users can reserve booths. Please login as an exhibitor.');
      return;
    }

    const confirm = window.confirm('Do you want to request/reserve this booth?');
    if (!confirm) return;

    try {
      setReservingId(boothId);
      const res = await api.post(`/booths/${boothId}/reserve`);
      if (res.data.success) {
        const updated = res.data.booth;
        setBooths((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
        alert('Booth reserved successfully.');
      } else {
        alert(res.data.message || 'Failed to reserve booth');
      }
    } catch (err) {
      console.error('Reserve error:', err);
      alert(err.response?.data?.message || 'Failed to reserve booth');
    } finally {
      setReservingId(null);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const onBoothUpdate = (updatedBooth) => {
      setBooths((prev) => {
        const idx = prev.findIndex(b => b._id === updatedBooth._id);
        if (idx === -1) return [updatedBooth, ...prev];
        const copy = [...prev];
        copy[idx] = updatedBooth;
        return copy;
      });
    };

    socket.on('booth:update', onBoothUpdate);

    return () => {
      socket.off('booth:update', onBoothUpdate);
    };
  }, [socket]);

  if (loading) return <div className="dashboard-container"><p>Loading booths...</p></div>;
  if (error) return <div className="dashboard-container"><p>{error}</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Booth Selection</h1>
      </div>
      <div className="dashboard-content">
        <div style={{ marginBottom: 16 }}>
          <label>Expo</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={expoId || ''} onChange={(e) => setExpoId(e.target.value)} disabled={exposLoading || expos.length === 0}>
              {exposLoading && <option value="">Loading expos...</option>}
              {!exposLoading && expos.length === 0 && <option value="">No expos available</option>}
              {!exposLoading && expos.length > 0 && <option value="">Select expo...</option>}
              {!exposLoading && expos.map(ex => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
            </select>
            <button className="auth-button" onClick={fetchExpos} disabled={exposLoading} style={{ padding: '8px 12px', fontSize: 14 }}>
              {exposLoading ? 'Refreshing...' : 'Refresh Expos'}
            </button>
            {user?.role === 'organizer' && (
              <>
                <button className="auth-button" onClick={() => setShowCreateModal(true)} style={{ padding: '8px 12px', fontSize: 14 }}>
                  Create Expo
                </button>
                {showCreateModal && (
                  <CreateExpoModal onClose={() => setShowCreateModal(false)} onCreated={fetchExpos} />
                )}
              </>
            )}
          </div>
          {exposError && <p style={{ color: 'red', marginTop: 8 }}>{exposError}</p>}
        </div>

        {booths.length === 0 ? (
          <div className="dashboard-message">No booths available for the selected expo.</div>
        ) : (
          <div className="booths-grid">
            {booths.map((b) => (
              <div key={b._id} className="booth-card">
                <h4>Booth {b.boothNumber}</h4>
                <p>Price: ${b.price}</p>
                <p>Status: {b.status}</p>
                {b.exhibitor && <small>Assigned to: {b.exhibitor.companyName || b.exhibitor.email}</small>}
                {b.status === 'available' && user?.role === 'exhibitor' && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => requestBooth(b._id)}
                      disabled={reservingId === b._id}
                      className="request-btn"
                    >
                      {reservingId === b._id ? 'Requesting...' : 'Request Booth'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booths;
