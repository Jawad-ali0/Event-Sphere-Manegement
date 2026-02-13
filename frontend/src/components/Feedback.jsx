import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';
import './Dashboard.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'general', subject: '', message: '', expo: '' });
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ status: '', type: '', priority: '' });

  const { user } = useAuth();
  const { showToast } = useToast();

  const isAdmin = user && (user.role === 'admin' || user.role === 'organizer');

  useEffect(() => {
    if (isAdmin) {
      fetchAllFeedback();
      fetchExpos();
    } else {
      fetchUserFeedback();
    }
  }, [user]);

  const fetchUserFeedback = async () => {
    try {
      const res = await api.get('/feedback/me');
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error('Fetch user feedback error:', err);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.type) params.append('type', filter.type);
      if (filter.priority) params.append('priority', filter.priority);

      const res = await api.get(`/feedback?${params}`);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error('Fetch all feedback error:', err);
    }
  };

  const fetchExpos = async () => {
    try {
      const res = await api.get('/expos');
      setExpos(res.data.expos || []);
    } catch (err) {
      console.error('Fetch expos error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/feedback', form);
      showToast({ message: 'Feedback submitted successfully', type: 'success' });
      setForm({ type: 'general', subject: '', message: '', expo: '' });
      setShowForm(false);
      if (isAdmin) fetchAllFeedback();
      else fetchUserFeedback();
    } catch (err) {
      console.error('Submit feedback error:', err);
      showToast({ message: err?.response?.data?.message || 'Failed to submit feedback', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/feedback/${id}`, { status });
      showToast({ message: 'Status updated', type: 'success' });
      fetchAllFeedback();
    } catch (err) {
      console.error('Update status error:', err);
      showToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleResponse = async (id, adminResponse) => {
    try {
      await api.put(`/feedback/${id}`, { adminResponse });
      showToast({ message: 'Response sent', type: 'success' });
      fetchAllFeedback();
    } catch (err) {
      console.error('Send response error:', err);
      showToast({ message: 'Failed to send response', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Feedback & Support</h1>
        {!isAdmin && (
          <button className="auth-button" onClick={() => setShowForm(true)}>
            Submit Feedback
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="dashboard-content" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug</option>
              <option value="general">General</option>
              <option value="support">Support</option>
            </select>
            <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button className="auth-button" onClick={fetchAllFeedback}>Filter</button>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        {feedbacks.length === 0 ? (
          <div className="dashboard-message">
            <p>No feedback found.</p>
          </div>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="feedback-card">
                <div className="feedback-header">
                  <h3>{fb.subject}</h3>
                  <span className={`status-badge status-${fb.status}`}>{fb.status}</span>
                </div>
                <p><strong>Type:</strong> {fb.type}</p>
                {fb.expo && <p><strong>Expo:</strong> {fb.expo.title}</p>}
                <p><strong>Message:</strong> {fb.message}</p>
                <p><small>By: {fb.user.firstName} {fb.user.lastName} on {new Date(fb.createdAt).toLocaleDateString()}</small></p>

                {isAdmin && (
                  <div className="admin-actions">
                    <select
                      value={fb.status}
                      onChange={(e) => handleStatusUpdate(fb._id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <textarea
                      placeholder="Admin response..."
                      onBlur={(e) => e.target.value && handleResponse(fb._id, e.target.value)}
                      rows={2}
                    />
                  </div>
                )}

                {fb.adminResponse && (
                  <div className="admin-response">
                    <p><strong>Admin Response:</strong> {fb.adminResponse}</p>
                    <small>Responded on {new Date(fb.respondedAt).toLocaleDateString()}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Submit Feedback</h3>
            <form onSubmit={handleSubmit}>
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              >
                <option value="general">General</option>
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug Report</option>
                <option value="support">Support Request</option>
              </select>

              <label>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                maxLength={200}
              />

              <label>Related Expo (Optional)</label>
              <select
                value={form.expo}
                onChange={(e) => setForm({ ...form, expo: e.target.value })}
              >
                <option value="">None</option>
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>{expo.title}</option>
                ))}
              </select>

              <label>Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                maxLength={1000}
                rows={4}
              />

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" className="auth-button" onClick={() => setShowForm(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
