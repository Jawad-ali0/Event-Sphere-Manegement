import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const ScheduleViewer = () => {
  const { expoId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [attendeeReg, setAttendeeReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleRes = await api.get(`/schedules/expo/${expoId}`);
        setSchedule(scheduleRes.data.schedule);

        if (user?.role === 'attendee') {
          const regRes = await api.get('/attendees/me');
          const reg = regRes.data.regs.find(r => r.expo._id === expoId);
          setAttendeeReg(reg);
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Unable to load schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [expoId, user]);

  const handleBookmarkSession = async (sessionId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await api.delete('/attendees/bookmark-session', { data: { expo: expoId, sessionId } });
      } else {
        await api.post('/attendees/bookmark-session', { expo: expoId, sessionId });
      }
      // Refresh schedule
      const scheduleRes = await api.get(`/schedules/expo/${expoId}`);
      setSchedule(scheduleRes.data.schedule);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleRegisterSession = async (sessionId, isRegistered) => {
    if (isRegistered) return;
    try {
      await api.post('/attendees/register-session', { expo: expoId, sessionId });
      // Refresh schedule
      const scheduleRes = await api.get(`/schedules/expo/${expoId}`);
      setSchedule(scheduleRes.data.schedule);
    } catch (err) {
      console.error('Session registration error:', err);
    }
  };

  if (loading) return (
    <div className="dashboard-container">
      <p>Loading schedule...</p>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <p>{error}</p>
    </div>
  );

  if (!schedule || !schedule.sessions) return (
    <div className="dashboard-container">
      <div className="dashboard-message">
        <p>No schedule available for this event.</p>
      </div>
    </div>
  );

  // Group sessions by date
  const sessionsByDate = schedule.sessions.reduce((acc, session) => {
    const date = new Date(session.startTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Event Schedule</h1>
      </div>
      <div className="dashboard-content">
        {Object.keys(sessionsByDate).map(date => (
          <div key={date} className="schedule-day" style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' }}>{date}</h2>
            <div className="sessions-list" style={{ display: 'grid', gap: '15px' }}>
              {sessionsByDate[date]
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .map(session => {
                  const isBookmarked = attendeeReg?.bookmarkedSessions?.includes(session._id);
                  const isRegistered = attendeeReg?.sessions?.some(s => s.session.toString() === session._id.toString());
                  return (
                    <div key={session._id} className="session-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#fff' }}>
                      <div className="session-time" style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '8px' }}>
                        {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                      </div>
                      <div className="session-details">
                        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{session.title}</h3>
                        {session.speakers && session.speakers.length > 0 && (
                          <p><strong>Speakers:</strong> {session.speakers.map(s => `${s.firstName} ${s.lastName}`).join(', ')}</p>
                        )}
                        {session.location && <p><strong>Location:</strong> {session.location}</p>}
                        {session.topic && <p><strong>Topic:</strong> {session.topic}</p>}
                        {session.capacity && <p><strong>Capacity:</strong> {session.capacity}</p>}
                        {session.description && <p style={{ marginBottom: '12px' }}>{session.description}</p>}

                        {user?.role === 'attendee' && attendeeReg && (
                          <div className="session-actions" style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                            <button
                              onClick={() => handleBookmarkSession(session._id, isBookmarked)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: isBookmarked ? '#ffc107' : '#f8f9fa',
                                color: isBookmarked ? '#fff' : '#000',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                            </button>
                            <button
                              onClick={() => handleRegisterSession(session._id, isRegistered)}
                              disabled={isRegistered}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: isRegistered ? '#28a745' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isRegistered ? 'not-allowed' : 'pointer',
                                opacity: isRegistered ? 0.6 : 1
                              }}
                            >
                              {isRegistered ? '✓ Registered' : 'Register'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {user?.role === 'attendee' && !attendeeReg && (
          <div className="registration-prompt" style={{ textAlign: 'center', marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <p style={{ marginBottom: '15px' }}>Please register for the event to bookmark and register for sessions.</p>
            <button
              onClick={() => window.location.href = `/expos`}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Register for Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleViewer;
