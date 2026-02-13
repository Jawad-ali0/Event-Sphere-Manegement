import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { title, date, location, description } = formData;

  // Redirect non-organizers/admins away from this page
  useEffect(() => {
    if (!authLoading && user && !(user.role === 'organizer' || user.role === 'admin')) {
      navigate('/events');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!title || !date || !location) {
      setError('Title, date and location are required');
      return;
    }

    try {
      setLoading(true);
      
      // Create the event first
      const eventRes = await api.post('/events', formData);
      const eventId = eventRes.data.event._id;
      
      // Then create an expo linked to this event
      const expoData = {
        title: title + ' Expo',
        startDate: date,
        endDate: date,
        location: location,
        description: description,
        event: eventId
      };
      
      const expoRes = await api.post('/expos', expoData);
      const expoId = expoRes.data.expo._id;
      
      // Create some default booths with products/services
      const booths = [
        {
          expo: expoId,
          boothNumber: 'A1',
          location: { x: 0, y: 0, section: 'A' },
          size: { width: 10, height: 10, area: 100 },
          price: 500,
          productsServices: [
            { name: 'Product 1', description: 'Description for product 1', category: 'Electronics' },
            { name: 'Service 1', description: 'Description for service 1', category: 'Services' }
          ]
        },
        {
          expo: expoId,
          boothNumber: 'A2',
          location: { x: 20, y: 0, section: 'A' },
          size: { width: 10, height: 10, area: 100 },
          price: 500,
          productsServices: [
            { name: 'Product 2', description: 'Description for product 2', category: 'Electronics' },
            { name: 'Service 2', description: 'Description for service 2', category: 'Services' }
          ]
        }
      ];
      
      // Create booths
      for (const booth of booths) {
        await api.post('/booths', booth);
      }
      
      setLoading(false);
      showToast({ message: 'Event, Expo and Products/Services created successfully', type: 'success' });
      navigate('/events');
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Create New Event</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" name="title" value={title} onChange={onChange} placeholder="Event Title" required />
      <input type="date" name="date" value={date} onChange={onChange} required />
      <input type="text" name="location" value={location} onChange={onChange} placeholder="Location" required />
      <textarea name="description" value={description} onChange={onChange} placeholder="Description" />
      <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
    </form>
  );
};

export default CreateEvent;
