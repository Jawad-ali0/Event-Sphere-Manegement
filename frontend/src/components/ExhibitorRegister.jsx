import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ExhibitorRegister = () => {
  const { user } = useAuth();
  const [expos, setExpos] = useState([]);
  const [form, setForm] = useState({ expo: '', companyName: '', companyDescription: '', products: '', logo: '', contactEmail: '', contactPhone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExpos = async () => {
      try {
        const res = await api.get('/expos');
        const list = res.data.expos || [];
        setExpos(list);
        if (list.length) {
          setForm(f => ({ ...f, expo: list[0]._id }));
        } else {
          setForm(f => ({ ...f, expo: '' }));
        }
      } catch (err) {
        console.error('Error loading expos:', err);
      }
    };
    loadExpos();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        expo: form.expo,
        companyName: form.companyName,
        companyDescription: form.companyDescription,
        productsServices: form.products.split(',').map(p => ({ name: p.trim() })),
        logo: form.logo,
        contactInfo: { email: form.contactEmail, phone: form.contactPhone },
      };

      const res = await api.post('/exhibitors/register', payload);
      setSuccess('Registration submitted successfully. Waiting for approval.');
      setForm({ ...form, companyName: '', companyDescription: '', products: '', logo: '' });
    } catch (err) {
      console.error('Exhibitor registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'exhibitor') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Exhibitor Registration</h1>
        </div>
        <div className="dashboard-content">
          <p>You must be an Exhibitor to access this page. Please update your role or contact an admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Exhibitor Registration</h1>
      </div>
      <div className="dashboard-content">
        <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
          <label>Expo</label>
          <select name="expo" value={form.expo} onChange={handleChange} required>
            {expos.length === 0 && <option value="" disabled>No expos available</option>}
            {expos.map(ex => <option key={ex._id} value={ex._id}>{ex.title} ({new Date(ex.startDate).toLocaleDateString()})</option>)}
          </select>

          <label>Company Name</label>
          <input name="companyName" value={form.companyName} onChange={handleChange} required style={{ padding: '10px', fontSize: '16px' }} />

          <label>Company Description</label>
          <textarea name="companyDescription" value={form.companyDescription} onChange={handleChange} rows={6} style={{ padding: '10px', fontSize: '16px', minHeight: 120 }} />

          <label>Products / Services (comma-separated)</label>
          <input name="products" value={form.products} onChange={handleChange} style={{ padding: '10px', fontSize: '16px' }} />

          <label>Logo URL</label>
          <input name="logo" value={form.logo} onChange={handleChange} style={{ padding: '10px', fontSize: '16px' }} />

          <label>Contact Email</label>
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} style={{ padding: '10px', fontSize: '16px' }} />

          <label>Contact Phone</label>
          <input name="contactPhone" value={form.contactPhone} onChange={handleChange} style={{ padding: '10px', fontSize: '16px' }} />

          <button className="auth-button" disabled={loading || !form.expo}>{loading ? 'Submitting...' : 'Submit Registration'}</button>

          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ExhibitorRegister;