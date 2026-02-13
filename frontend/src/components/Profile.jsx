import './Dashboard.css';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get('/exhibitors/my-registrations');
        setRegistrations(res.data.registrations || []);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        showToast({ message: 'Failed to load registrations', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'exhibitor') {
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [user, showToast]);

  const handleEdit = (reg) => {
    setEditing(reg._id);
    setForm({
      companyName: reg.companyName,
      companyDescription: reg.companyDescription,
      logo: reg.logo,
      contactInfo: reg.contactInfo,
      productsServices: reg.productsServices,
      staff: reg.staff,
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/exhibitors/registration/${editing}`, form);
      setRegistrations(prev => prev.map(r => r._id === editing ? { ...r, ...form } : r));
      setEditing(null);
      showToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast({ message: 'Failed to update profile', type: 'error' });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  if (user?.role !== 'exhibitor') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Profile</h1>
        </div>
        <div className="dashboard-content">
          <p>You must be an Exhibitor to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>
      <div className="dashboard-content">
        {loading ? (
          <p>Loading...</p>
        ) : registrations.length === 0 ? (
          <p>No registrations found. Please register for an expo first.</p>
        ) : (
          <div>
            {registrations.map(reg => (
              <div key={reg._id} style={{ border: '1px solid #eee', padding: 16, marginBottom: 16 }}>
                <h3>{reg.expo.title}</h3>
                <p>Status: {reg.status}</p>
                {editing === reg._id ? (
                  <div>
                    <label>Company Name</label>
                    <input name="companyName" value={form.companyName || ''} onChange={handleChange} />

                    <label>Company Description</label>
                    <textarea name="companyDescription" value={form.companyDescription || ''} onChange={handleChange} rows={4} />

                    <label>Logo URL</label>
                    <input name="logo" value={form.logo || ''} onChange={handleChange} />

                    <label>Contact Email</label>
                    <input name="contactInfo.email" value={form.contactInfo?.email || ''} onChange={handleChange} />

                    <label>Contact Phone</label>
                    <input name="contactInfo.phone" value={form.contactInfo?.phone || ''} onChange={handleChange} />

                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <p><strong>Company:</strong> {reg.companyName}</p>
                    <p><strong>Description:</strong> {reg.companyDescription}</p>
                    <p><strong>Contact:</strong> {reg.contactInfo?.email} {reg.contactInfo?.phone}</p>
                    <button onClick={() => handleEdit(reg)}>Edit Profile</button>
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

export default Profile;
