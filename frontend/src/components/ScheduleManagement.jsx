import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';

const ScheduleManagement = () => {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await api.get('/expos');
        setExpos(res.data.expos || []);
      } catch (err) {
        console.error('Error fetching expos:', err);
      }
    };
    fetchExpos();
  }, []);

  const fetchSchedule = async () => {
    if (!selectedExpo) return;
    try {
      setLoading(true);
      const res = await api.get(`/schedules/expo/${selectedExpo}`);
      setSchedule(res.data.schedule);
      setSessions(res.data.schedule?.sessions || []);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setSchedule(null);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [selectedExpo]);

  const createSchedule = async () => {
    try {
      await api.post('/schedules', { expo: selectedExpo });
      showToast({ message: 'Schedule created successfully', type: 'success' });
      fetchSchedule();
    } catch (err) {
      console.error('Error creating schedule:', err);
      showToast({ message: 'Failed to create schedule', type: 'error' });
    }
  };

  const addSession = async (sessionData) => {
    try {
      await api.post(`/schedules/${schedule._id}/sessions`, sessionData);
      showToast({ message: 'Session added successfully', type: 'success' });
      fetchSchedule();
      setShowCreateSession(false);
    } catch (err) {
      console.error('Error adding session:', err);
      showToast({ message: 'Failed to add session', type: 'error' });
    }
  };

  const updateSession = async (sessionId, sessionData) => {
    try {
      await api.put(`/schedules/${schedule._id}/sessions/${sessionId}`, sessionData);
      showToast({ message: 'Session updated successfully', type: 'success' });
      fetchSchedule();
      setEditingSession(null);
    } catch (err) {
      console.error('Error updating session:', err);
      showToast({ message: 'Failed to update session', type: 'error' });
    }
  };

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await api.delete(`/schedules/${schedule._id}/sessions/${sessionId}`);
      showToast({ message: 'Session deleted successfully', type: 'success' });
      fetchSchedule();
    } catch (err) {
      console.error('Error deleting session:', err);
      showToast({ message: 'Failed to delete session', type: 'error' });
    }
  };

  const canManage = user && (user.role === 'organizer' || user.role === 'admin');

  if (!canManage) {
    return <div className="dashboard-container"><p>You don't have permission to manage schedules.</p></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Schedule Management</h1>
      </div>
      <div className="dashboard-content">
        <div style={{ marginBottom: 16 }}>
          <label>Select Expo</label>
          <select value={selectedExpo || ''} onChange={(e) => setSelectedExpo(e.target.value)}>
            <option value="">Select an expo</option>
            {expos.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
          </select>
        </div>

        {selectedExpo && (
          <div>
            {!schedule ? (
              <div>
                <p>No schedule exists for this expo.</p>
                <button className="auth-button" onClick={createSchedule}>Create Schedule</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3>Sessions</h3>
                  <button className="auth-button" onClick={() => setShowCreateSession(true)}>Add Session</button>
                </div>

                {loading ? <p>Loading sessions...</p> : (
                  <div>
                    {sessions.length === 0 ? (
                      <p>No sessions yet.</p>
                    ) : (
                      sessions.map(session => (
                        <div key={session._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                          <h4>{session.title}</h4>
                          <p>{new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}</p>
                          <p>Location: {session.location}</p>
                          <p>{session.description}</p>
                          <div style={{ marginTop: 8 }}>
                            <button className="auth-button" style={{ marginRight: 8 }} onClick={() => setEditingSession(session)}>Edit</button>
                            <button className="auth-button" style={{ backgroundColor: '#dc3545' }} onClick={() => deleteSession(session._id)}>Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(showCreateSession || editingSession) && (
          <SessionModal
            onClose={() => { setShowCreateSession(false); setEditingSession(null); }}
            onSave={editingSession ? (data) => updateSession(editingSession._id, data) : addSession}
            session={editingSession}
          />
        )}
      </div>
    </div>
  );
};

const SessionModal = ({ onClose, onSave, session }) => {
  const [form, setForm] = useState({
    title: session?.title || '',
    startTime: session?.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
    endTime: session?.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : '',
    location: session?.location || '',
    description: session?.description || '',
    speakers: session?.speakers || [],
    topic: session?.topic || '',
    capacity: session?.capacity || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      console.error('Error saving session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{session ? 'Edit Session' : 'Add Session'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />

          <label>Start Time</label>
          <input name="startTime" type="datetime-local" value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))} required />

          <label>End Time</label>
          <input name="endTime" type="datetime-local" value={form.endTime} onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))} required />

          <label>Location</label>
          <input name="location" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />

          <label>Topic</label>
          <input name="topic" value={form.topic} onChange={(e) => setForm(f => ({ ...f, topic: e.target.value }))} />

          <label>Capacity</label>
          <input name="capacity" type="number" value={form.capacity} onChange={(e) => setForm(f => ({ ...f, capacity: e.target.value }))} />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="button" className="auth-button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="auth-button" disabled={loading}>{loading ? 'Saving...' : (session ? 'Update' : 'Add')} Session</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleManagement;
