import { useEffect, useState } from 'react';
import './Schedules.css';
import api from '../services/api';

const Schedules = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback sample data (kept concise)
  const fallback = [
    {
      day: 'Day 1',
      date: 'March 15, 2026',
      sessions: [
        { id: 's1', time: '9:00 - 10:00', title: 'Opening Keynote: The Future of Events', description: 'Join our opening keynote', speaker: 'Sarah Chen', role: 'CTO', company: 'TechFlow', track: 'Keynote', room: 'Main Stage', type: 'keynote' },
      ]
    }
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const exposRes = await api.get('/expos');
        const expos = exposRes.data.expos || [];
        if (expos.length === 0) {
          setScheduleData(fallback);
          setLoading(false);
          return;
        }

        const expoId = expos[0]._id;
        const res = await api.get(`/schedules/expo/${expoId}`);
        const schedule = res.data.schedule;
        if (!schedule) {
          setScheduleData(fallback);
        } else {
          // Transform schedule.sessions into grouped days if necessary
          // For now, simple grouping by date
          const groups = {};
          (schedule.sessions || []).forEach((sess) => {
            const dateKey = new Date(sess.startTime).toLocaleDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(sess);
          });

          const grouped = Object.keys(groups).map((date, idx) => ({ day: `Day ${idx + 1}`, date, sessions: groups[date] }));
          setScheduleData(grouped.length ? grouped : fallback);
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setScheduleData(fallback);
        // setError('Unable to fetch schedule'); // Commented out to show fallback instead
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const getTrackColor = (track) => {
    const colors = {
      keynote: '#667eea',
      session: '#764ba2',
      development: '#667eea',
      design: '#f093fb',
      technology: '#4facfe',
      marketing: '#43e97b',
      security: '#fa709a',
      break: '#ffa502',
      closing: '#667eea'
    };
    return colors[(track || 'session').toLowerCase()] || colors.session;
  };

  if (loading) return <div className="schedules-container"><p>Loading schedule...</p></div>;

  const data = scheduleData || fallback;

  return (
    <div className="schedules-container">
      {/* Page Header */}
      <section className="schedules-header">
        <div className="container">
          <h1>Event Schedule</h1>
          <p>Explore our comprehensive event program</p>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="schedules-content">
        <div className="container">
          {/* Day Tabs */}
          <div className="schedule-tabs" data-aos="fade-up">
            {data.map((day, index) => (
              <button
                key={index}
                className={`tab-button ${activeDay === index ? 'active' : ''}`}
                onClick={() => setActiveDay(index)}
              >
                <span className="tab-day">{day.day}</span>
                <span className="tab-date">{day.date}</span>
              </button>
            ))}
          </div>

          {/* Sessions Timeline */}
          <div className="schedule-timeline" data-aos="fade-up" data-aos-delay="200">
            {data[activeDay].sessions.map((session, index) => (
              <div key={session._id || session.id} className={`session-block type-${session.type || 'session'}`} data-aos="fade-up" data-aos-delay={300 + index * 50}>
                <div className="session-time">
                  <span className="time-text">{session.time || `${new Date(session.startTime).toLocaleTimeString()} - ${new Date(session.endTime).toLocaleTimeString()}`}</span>
                </div>

                <div className="session-card">
                  <div className="session-header">
                    <div className="session-badges">
                      <span className="track-badge" style={{ backgroundColor: `${getTrackColor(session.track)}30`, color: getTrackColor(session.track) }}>
                        {session.track || 'Session'}
                      </span>
                      <span className="room-badge">{session.location}</span>
                    </div>
                    <h3 className="session-title">{session.title}</h3>
                  </div>

                  <p className="session-description">{session.description}</p>

                  {session.speakers && session.speakers[0] && (
                    <div className="session-speaker">
                      <div className="speaker-avatar">
                        {session.speakers[0].firstName ? session.speakers[0].firstName.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="speaker-info">
                        <p className="speaker-name">{(session.speakers[0].firstName || '') + ' ' + (session.speakers[0].lastName || '')}</p>
                        <p className="speaker-role">{session.speakers[0].companyName || ''}</p>
                      </div>
                    </div>
                  )}

                  {session.type !== 'break' && session.type !== 'closing' && (
                    <button className="add-schedule-btn">
                      <i className="bi bi-calendar-plus"></i>
                      Add to My Schedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Download Agenda */}
          <div className="schedule-actions" data-aos="fade-up" data-aos-delay="400">
            <button className="btn btn-primary">
              <i className="bi bi-download"></i>
              Download Full Agenda
            </button>
            <button className="btn btn-outline">
              <i className="bi bi-calendar-event"></i>
              Export to Calendar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Schedules;
