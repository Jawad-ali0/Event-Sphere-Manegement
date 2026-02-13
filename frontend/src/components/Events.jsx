import './Dashboard.css';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Events view supports role-specific actions:
// - organizers/admins can view "My Events" and delete/update their events
// - attendees only see public events and cannot delete/create


const Events = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'mine'

  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        let res;
        if (viewMode === 'mine') {
          res = await api.get('/events/mine');
        } else {
          res = await api.get('/events');
        }
        setEvents(res.data.events || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load events');
      } finally {
        setLoadingEvents(false);
      }
    };

    // Don't fetch "mine" until auth finished
    if (viewMode === 'mine' && loading) return;

    fetchEvents();
  }, [viewMode, loading]);

  const canCreate = !loading && user && (user.role === 'organizer' || user.role === 'admin');

  const handleViewChange = (mode) => {
    setViewMode(mode);
    setError(null);
  };

  const deleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h1>Events</h1>
          {user && <span style={{ marginLeft: '8px', color: '#666' }}>Role: {user.role}</span>}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {canCreate && <Link to="/events/create" className="btn">Create Event</Link>}
          {/* Organizer: toggle view */}
          {canCreate && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className={viewMode === 'all' ? 'btn active' : 'btn'} onClick={() => handleViewChange('all')}>All</button>
              <button className={viewMode === 'mine' ? 'btn active' : 'btn'} onClick={() => handleViewChange('mine')}>My Events</button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        {loadingEvents ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <div className="events-list">
            {events.map((e) => (
              <div key={e._id} className="event-card">
                <h3>{e.title}</h3>
                <p><strong>Date:</strong> {new Date(e.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {e.location}</p>
                {e.description && <p>{e.description}</p>}
                
                {/* Show Expo information if available */}
                {e.expo && (
                  <div style={{ marginTop: '12px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Expo: {e.expo.title}</h4>
                    <p><strong>Expo Location:</strong> {e.expo.location}</p>
                    <p><strong>Expo Dates:</strong> {new Date(e.expo.startDate).toLocaleDateString()} - {new Date(e.expo.endDate).toLocaleDateString()}</p>
                    {e.expo.description && <p>{e.expo.description}</p>}
                    
                    {/* Show booths with products/services if available */}
                    {e.expo.booths && e.expo.booths.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <h5 style={{ margin: '0 0 8px 0' }}>Products & Services:</h5>
                        {e.expo.booths.map((booth) => (
                          <div key={booth._id} style={{ marginBottom: '10px', padding: '8px', background: 'white', borderRadius: '4px' }}>
                            <p><strong>Booth:</strong> {booth.boothNumber}</p>
                            <p><strong>Status:</strong> {booth.status}</p>
                            {booth.productsServices && booth.productsServices.length > 0 && (
                              <div style={{ marginLeft: '10px' }}>
                                {booth.productsServices.map((product, index) => (
                                  <div key={index} style={{ marginBottom: '5px' }}>
                                    <p style={{ margin: '2px 0' }}>• <strong>{product.name}</strong> ({product.category})</p>
                                    <p style={{ margin: '2px 0', fontSize: '12px', color: '#666' }}>{product.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {canCreate && viewMode === 'mine' && (
                  <div style={{ marginTop: '8px' }}>
                    <button className="btn" onClick={() => deleteEvent(e._id)} style={{ background: '#e74c3c' }}>Delete</button>
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

export default Events;
