import './Dashboard.css';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CreateExpoModal from './CreateExpoModal';
import { useToast } from './ToastContext';

const Expos = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExpo, setEditingExpo] = useState(null);
  const [attendeeRegistrations, setAttendeeRegistrations] = useState([]);

  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchExpos = async () => {
    try {
      const res = await api.get('/expos');
      setExpos(res.data.expos || []);
    } catch (err) {
      console.error('Error fetching expos:', err);
      setError('Unable to fetch expos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpos();
    if (user && user.role === 'attendee') {
      fetchAttendeeRegistrations();
    }
  }, [user]);

  const fetchAttendeeRegistrations = async () => {
    try {
      const res = await api.get('/attendees/me');
      setAttendeeRegistrations(res.data.regs || []);
    } catch (err) {
      console.error('Error fetching attendee registrations:', err);
      // Don't set error state for attendee registrations to avoid breaking the page
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading expos...</p></div>;
  if (error) return <div className="dashboard-container"><p>{error}</p></div>;

  const handleEdit = (expo) => {
    setEditingExpo(expo);
    setShowCreateModal(true);
  };

  const handleDelete = async (expoId) => {
    if (!window.confirm('Are you sure you want to delete this expo? This action cannot be undone.')) return;
    try {
      await api.delete(`/expos/${expoId}`);
      showToast({ message: 'Expo deleted successfully', type: 'success' });
      fetchExpos();
    } catch (err) {
      console.error('Delete expo error:', err);
      showToast({ message: err?.response?.data?.message || 'Failed to delete expo', type: 'error' });
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingExpo(null);
  };

  const handleModalCreated = () => {
    fetchExpos();
    handleModalClose();
  };

  const canManage = user && (user.role === 'organizer' || user.role === 'admin');
  const isAttendee = user && user.role === 'attendee';

  const handleRegisterAttendee = async (expoId) => {
    try {
      await api.post('/attendees/register', { expo: expoId });
      showToast({ message: 'Successfully registered for the event!', type: 'success' });
      fetchExpos(); // Refresh to update registration status
    } catch (err) {
      console.error('Registration error:', err);
      showToast({ message: err?.response?.data?.message || 'Failed to register for event', type: 'error' });
    }
  };

  const isRegistered = (expoId) => {
    return attendeeRegistrations.some(reg => reg.expo._id === expoId);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{canManage ? 'Expo Management' : 'Available Expos'}</h1>
        {canManage && (
          <button className="auth-button" onClick={() => setShowCreateModal(true)}>
            Create New Expo
          </button>
        )}
      </div>
      <div className="dashboard-content">
        {expos.length === 0 ? (
          <div className="dashboard-message">No expos found.</div>
        ) : (
          <div className="expo-list">
            {expos.map((expo) => (
              <div className="expo-card" key={expo._id}>
                <h3>{expo.title}</h3>
                <p>{expo.location}</p>
                <p>{new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</p>
                <p>{expo.description}</p>
                <small>Status: {expo.status}</small>
                {canManage && (
                  <div style={{ marginTop: 8 }}>
                    <button className="auth-button" style={{ marginRight: 8 }} onClick={() => handleEdit(expo)}>
                      Edit
                    </button>
                    <button className="auth-button" style={{ backgroundColor: '#dc3545' }} onClick={() => handleDelete(expo._id)}>
                      Delete
                    </button>
                  </div>
                )}
                {isAttendee && (
                  <div style={{ marginTop: 8 }}>
                    {isRegistered(expo._id) ? (
                      <button
                        className="auth-button"
                        style={{ backgroundColor: '#28a745', cursor: 'not-allowed' }}
                        disabled
                      >
                        ✓ Registered
                      </button>
                    ) : (
                      <button
                        className="auth-button"
                        onClick={() => handleRegisterAttendee(expo._id)}
                      >
                        Register for Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showCreateModal && (
        <CreateExpoModal
          onClose={handleModalClose}
          onCreated={handleModalCreated}
          editingExpo={editingExpo}
        />
      )}
    </div>
  );
};

export default Expos;
