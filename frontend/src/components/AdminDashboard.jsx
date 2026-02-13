/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import CreateBoothModal from './CreateBoothModal';
import FloorPlan from './FloorPlan';

const AdminDashboard = () => {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [booths, setBooths] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [messages, setMessages] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showCreateBooth, setShowCreateBooth] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { user, logout } = useAuth();

  useEffect(() => {
    const loadExpos = async () => {
      try {
        const res = await api.get('/expos');
        setExpos(res.data.expos || []);
        if (res.data.expos && res.data.expos.length) setSelectedExpo(res.data.expos[0]._id);
      } catch (err) {
        console.error('Load expos error:', err);
      }
    };
    loadExpos();

    // Load overview data by default for admin users
    fetchUsers();
    fetchContacts();
    fetchAttendees();
  }, []);

  const fetchData = async () => {
    if (!selectedExpo) return;
    setLoading(true);
    try {
      const regs = await api.get(`/exhibitors/expo/${selectedExpo}`);
      setRegistrations(regs.data.regs || []);
      const b = await api.get(`/booths/expo/${selectedExpo}`);
      setBooths(b.data.booths || []);
    } catch (err) {
      console.error('Load admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedExpo]);

  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await api.get('/contact/all');
      setContacts(res.data.data || []);
    } catch (err) {
      console.error('Load contacts error:', err);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    setFeedbacksLoading(true);
    try {
      const res = await api.get('/feedback');
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error('Load feedbacks error:', err);
    } finally {
      setFeedbacksLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/auth/all');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Load users error:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAttendees = async () => {
    setAttendeesLoading(true);
    try {
      // Get all attendee registrations across all expos
      const allAttendees = [];
      for (const expo of expos) {
        try {
          const res = await api.get(`/attendees/expo/${expo._id}`);
          if (res.data.attendees) {
            allAttendees.push(...res.data.attendees);
          }
        } catch (err) {
          console.error(`Error fetching attendees for expo ${expo._id}:`, err);
        }
      }
      setAttendees(allAttendees);
    } catch (err) {
      console.error('Load attendees error:', err);
    } finally {
      setAttendeesLoading(false);
    }
  };

  const fetchSchedules = async () => {
    setSchedulesLoading(true);
    try {
      // Note: This would need a backend endpoint to get all schedules
      setSchedules([]);
    } catch (err) {
      console.error('Load schedules error:', err);
    } finally {
      setSchedulesLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      // Note: This would need a backend endpoint to get all messages
      setMessages([]);
    } catch (err) {
      console.error('Load messages error:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts();
    } else if (activeTab === 'feedback') {
      fetchFeedbacks();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'attendees') {
      fetchAttendees();
    } else if (activeTab === 'schedules') {
      fetchSchedules();
    } else if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  // Listen for registration updates and refresh when something changes for the selected expo
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handler = (payload) => {
      if (!payload || !payload.registration) return;
      const expoId = payload.registration.expo?._id ? payload.registration.expo._id : payload.registration.expo;
      if (expoId && expoId.toString() === (selectedExpo || '').toString()) {
        fetchData();
      }
    };

    socket.on('registration:update', handler);
    return () => socket.off('registration:update', handler);
  }, [socket, selectedExpo]);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/exhibitors/${id}/status`, { status });
      setRegistrations((prev) => prev.map(r => r._id === id ? res.data.reg : r));
      setMessage('Status updated');
    } catch (err) {
      console.error('Update status error:', err);
      setMessage('Failed to update status');
    }
  };

  const assignBooth = async (regId, boothId) => {
    try {
      const res = await api.put(`/exhibitors/${regId}/assign-booth`, { boothId });
      setRegistrations((prev) => prev.map(r => r._id === regId ? res.data.reg : r));
      setMessage('Booth assigned');
    } catch (err) {
      console.error('Assign booth error:', err);
      setMessage('Failed to assign booth');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h1>Admin Dashboard</h1>
          
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={{ color: 'black' }}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'expos' ? 'active' : ''}`}
            onClick={() => setActiveTab('expos')}
            style={{ color: 'black' }}
          >
            Expo Management
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            style={{ color: 'black' }}
          >
            User Management ({users.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'attendees' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendees')}
            style={{ color: 'black' }}
          >
            Attendee Management ({attendees.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
            style={{ color: 'black' }}
          >
            Schedule Management ({schedules.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            style={{ color: 'black' }}
          >
            Analytics
          </button>
          <button
            className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
            style={{ color: 'black' }}
          >
            Contact Messages ({contacts.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
            style={{ color: 'black' }}
          >
            Feedback ({feedbacks.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
            style={{ color: 'black' }}
          >
            Messages ({messages.length})
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div>
            <h3>System Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                <h4>Total Expos</h4>
                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>{expos.length}</p>
              </div>
              <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                <h4>Total Users</h4>
                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>{users.length}</p>
              </div>
              <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                <h4>Total Attendees</h4>
                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>{attendees.length}</p>
              </div>
              <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                <h4>Contact Messages</h4>
                <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#dc3545' }}>{contacts.length}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                <h4>Recent Expos</h4>
                {expos.slice(0, 3).map(expo => (
                  <div key={expo._id} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <strong>{expo.title}</strong>
                    <br />
                    <small>{new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</small>
                  </div>
                ))}
                {expos.length === 0 && <p>No expos yet.</p>}
              </div>

              <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                <h4>Recent Contact Messages</h4>
                {contacts.slice(0, 3).map(contact => (
                  <div key={contact._id} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <strong>{contact.subject}</strong>
                    <br />
                    <small>From: {contact.name} - {new Date(contact.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
                {contacts.length === 0 && <p>No contact messages yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3>User Management</h3>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div>
                {users.map(user => (
                  <div key={user.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                    <h4>{user.firstName} {user.lastName} <small>({user.role})</small></h4>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    {user.companyName && <p><strong>Company:</strong> {user.companyName}</p>}
                    <p><small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendees' && (
          <div>
            <h3>Attendee Management</h3>
            {attendeesLoading ? (
              <p>Loading attendees...</p>
            ) : attendees.length === 0 ? (
              <p>No attendees found.</p>
            ) : (
              <div>
                {attendees.map(attendee => (
                  <div key={attendee._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                    <h4>{attendee.attendee?.firstName} {attendee.attendee?.lastName}</h4>
                    <p><strong>Email:</strong> {attendee.attendee?.email}</p>
                    <p><strong>Expo:</strong> {attendee.expo?.title}</p>
                    <p><strong>Bookmarked Sessions:</strong> {attendee.bookmarkedSessions?.length || 0}</p>
                    <p><strong>Registered Sessions:</strong> {attendee.sessions?.length || 0}</p>
                    <p><small>Registered: {new Date(attendee.createdAt).toLocaleDateString()}</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedules' && (
          <div>
            <h3>Schedule Management</h3>
            {schedulesLoading ? (
              <p>Loading schedules...</p>
            ) : schedules.length === 0 ? (
              <p>No schedules found.</p>
            ) : (
              <div>
                {schedules.map(schedule => (
                  <div key={schedule._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                    <h4>Schedule for {schedule.expo?.title}</h4>
                    <p><strong>Sessions:</strong> {schedule.sessions?.length || 0}</p>
                    <p><small>Created: {new Date(schedule.createdAt).toLocaleDateString()}</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3>Analytics Dashboard</h3>
            <p>Analytics features are available in the dedicated Analytics component.</p>
            <p>Use the Analytics tab in the main navigation for detailed reports.</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <h3>Messages</h3>
            {messagesLoading ? (
              <p>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p>No messages found.</p>
            ) : (
              <div>
                {messages.map(message => (
                  <div key={message._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                    <h4>{message.subject}</h4>
                    <p><strong>From:</strong> {message.sender?.firstName} {message.sender?.lastName}</p>
                    <p><strong>To:</strong> {message.recipient?.firstName} {message.recipient?.lastName}</p>
                    <p><strong>Message:</strong> {message.content}</p>
                    <p><small>Sent: {new Date(message.createdAt).toLocaleDateString()}</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'expos' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label>Expo</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <select value={selectedExpo || ''} onChange={(e) => setSelectedExpo(e.target.value)}>
                  {expos.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                </select>

                {/* If there are no booths yet, allow organizers / admins to create one */}
                {selectedExpo && booths.length === 0 && (user?.role === 'organizer' || user?.role === 'admin') && (
                  <button className="auth-button" style={{ padding: '8px 12px' }} onClick={() => setShowCreateBooth(true)}>
                    Create Booth
                  </button>
                )}

                {showCreateBooth && (
                  <CreateBoothModal expoId={selectedExpo} onClose={() => setShowCreateBooth(false)} onCreated={() => fetchData()} />
                )}
              </div>
            </div>

            {loading ? <p>Loading...</p> : (
              <div>
                <h3>Exhibitor Registrations</h3>
                {registrations.length === 0 && <p>No registrations yet.</p>}
                <div>
                  {registrations.map(reg => (
                    <div key={reg._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                      <h4>{reg.companyName} <small>({reg.status})</small></h4>
                      <p>{reg.companyDescription}</p>
                      <p>Contact: {reg.contactInfo?.email} {reg.contactInfo?.phone}</p>

                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => updateStatus(reg._id, 'approved')}>Approve</button>
                        <button onClick={() => updateStatus(reg._id, 'rejected')}>Reject</button>
                        <span style={{ marginLeft: 8 }}>Assign Booth:</span>
                        {booths.length === 0 ? (
                          <span style={{ marginLeft: 8, color: '#666' }}>No booths for this expo</span>
                        ) : (
                          <select
                            onChange={(e) => assignBooth(reg._id, e.target.value)}
                            value={reg.booth && (reg.booth._id ? reg.booth._id : reg.booth) ? (reg.booth._id ? reg.booth._id : reg.booth) : ''}
                          >
                            <option value="">Select booth</option>
                            {booths.map(b => {
                              const boothId = String(b._id);
                              const regBoothId = reg.booth ? String(reg.booth._id ? reg.booth._id : reg.booth) : '';
                              const isCurrent = boothId === regBoothId;
                              const disabled = b.status !== 'available' && !isCurrent;
                              return (
                                <option key={b._id} value={b._id} disabled={disabled}>
                                  {`Booth ${b.boothNumber} - $${b.price}${b.status !== 'available' ? ` (${b.status})` : ''}`}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h3>Contact Messages</h3>
            {contactsLoading ? (
              <p>Loading contact messages...</p>
            ) : contacts.length === 0 ? (
              <p>No contact messages yet.</p>
            ) : (
              <div>
                {contacts.map(contact => (
                  <div key={contact._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                    <h4>{contact.subject} <small>({contact.status})</small></h4>
                    <p><strong>From:</strong> {contact.name} ({contact.email})</p>
                    {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
                    <p><strong>Type:</strong> {contact.feedbackType}</p>
                    <p><strong>Message:</strong> {contact.message}</p>
                    <p><small>Submitted: {new Date(contact.createdAt).toLocaleString()}</small></p>
                    {contact.adminReply && (
                      <div style={{ backgroundColor: '#f0f0f0', padding: 8, marginTop: 8 }}>
                        <p><strong>Admin Reply:</strong> {contact.adminReply}</p>
                        <p><small>Replied: {new Date(contact.repliedAt).toLocaleString()}</small></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <h3>User Feedback</h3>
            {feedbacksLoading ? (
              <p>Loading feedback...</p>
            ) : feedbacks.length === 0 ? (
              <p>No feedback yet.</p>
            ) : (
              <div>
                {feedbacks.map(feedback => (
                  <div key={feedback._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
                    <h4>{feedback.subject} <small>({feedback.status})</small></h4>
                    <p><strong>Type:</strong> {feedback.type}</p>
                    <p><strong>Message:</strong> {feedback.message}</p>
                    <p><small>From: {feedback.user?.firstName} {feedback.user?.lastName} - {new Date(feedback.createdAt).toLocaleString()}</small></p>
                    {feedback.adminResponse && (
                      <div style={{ backgroundColor: '#f0f0f0', padding: 8, marginTop: 8 }}>
                        <p><strong>Admin Response:</strong> {feedback.adminResponse}</p>
                        <p><small>Responded: {new Date(feedback.respondedAt).toLocaleString()}</small></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;