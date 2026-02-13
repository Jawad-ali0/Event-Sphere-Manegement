import { useState } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CreateBoothModal = ({ expoId, onClose, onCreated }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ boothNumber: '', location: '', size: '', price: '' , features: ''});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const validateField = (name, value) => {
    let msg = '';
    if (name === 'boothNumber') {
      if (!value || !value.trim()) msg = 'Booth number is required';
    }
    if (name === 'price') {
      if (!value) msg = 'Price is required';
      else if (isNaN(Number(value)) || Number(value) < 0) msg = 'Price must be a positive number';
    }
    setErrors((p) => ({ ...p, [name]: msg }));
    return msg === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    validateField(name, value);
  };

  const validateAll = () => {
    const next = {};
    let valid = true;
    if (!form.boothNumber || !form.boothNumber.trim()) { next.boothNumber = 'Booth number is required'; valid = false; }
    if (!form.price) { next.price = 'Price is required'; valid = false; }
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) { next.price = 'Price must be a positive number'; valid = false; }
    setErrors(next);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateAll()) return;

    try {
      setLoading(true);
      const payload = {
        expo: expoId,
        boothNumber: form.boothNumber,
        location: form.location,
        size: form.size,
        price: Number(form.price),
        features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const res = await api.post('/booths', payload);
      setLoading(false);
      showToast({ message: 'Booth created', type: 'success' });
      if (onCreated) onCreated(res.data.booth);
      if (onClose) onClose();
    } catch (err) {
      setLoading(false);
      console.error('Create booth error:', err);
      const msg = err?.response?.data?.message || 'Failed to create booth';
      setError(msg);
      showToast({ message: msg, type: 'error' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create Booth</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Booth Number</label>
          <input name="boothNumber" value={form.boothNumber} onChange={handleChange} className={errors.boothNumber ? 'input-error' : ''} />
          {errors.boothNumber && <small className="field-error">{errors.boothNumber}</small>}

          <label>Price</label>
          <input name="price" value={form.price} onChange={handleChange} className={errors.price ? 'input-error' : ''} />
          {errors.price && <small className="field-error">{errors.price}</small>}

          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} />

          <label>Size</label>
          <input name="size" value={form.size} onChange={handleChange} />

          <label>Features (comma-separated)</label>
          <input name="features" value={form.features} onChange={handleChange} />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="button" className="auth-button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="auth-button" disabled={loading}>{loading ? 'Creating...' : 'Create Booth'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoothModal;
