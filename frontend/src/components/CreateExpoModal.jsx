import { useState } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CreateExpoModal = ({ onClose, onCreated, editingExpo }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: editingExpo?.title || '',
    startDate: editingExpo?.startDate ? new Date(editingExpo.startDate).toISOString().split('T')[0] : '',
    endDate: editingExpo?.endDate ? new Date(editingExpo.endDate).toISOString().split('T')[0] : '',
    location: editingExpo?.location || '',
    description: editingExpo?.description || '',
    theme: editingExpo?.theme || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let msg = '';
    if (name === 'title') {
      if (!value || !value.trim()) msg = 'Title is required';
      else if (value.trim().length < 3) msg = 'Title must be at least 3 characters';
    }
    if (name === 'startDate') {
      if (!value) msg = 'Start date is required';
      else if (form.endDate && new Date(value) > new Date(form.endDate)) msg = 'Start date must be before end date';
    }
    if (name === 'endDate') {
      if (!value) msg = 'End date is required';
      else if (form.startDate && new Date(value) < new Date(form.startDate)) msg = 'End date must be after start date';
    }
    if (name === 'location') {
      if (!value || !value.trim()) msg = 'Location is required';
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === '';
  };

  const validateAll = () => {
    const fieldNames = ['title', 'startDate', 'endDate', 'location'];
    const next = {};
    let valid = true;
    for (const n of fieldNames) {
      const value = form[n];
      let msg = '';
      if (n === 'title') {
        if (!value || !value.trim()) msg = 'Title is required';
        else if (value.trim().length < 3) msg = 'Title must be at least 3 characters';
      }
      if (n === 'startDate') {
        if (!value) msg = 'Start date is required';
      }
      if (n === 'endDate') {
        if (!value) msg = 'End date is required';
      }
      if (n === 'location') {
        if (!value || !value.trim()) msg = 'Location is required';
      }
      // cross-field date check
      if (!msg && form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
        next.startDate = 'Start date must be before end date';
        next.endDate = 'End date must be after start date';
        valid = false;
      }

      if (msg) {
        next[n] = msg;
        valid = false;
      }
    }
    setErrors(next);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // validate as user types
    validateField(name, value);
    // if editing dates, also revalidate counterpart
    if (name === 'startDate' && form.endDate) validateField('endDate', form.endDate);
    if (name === 'endDate' && form.startDate) validateField('startDate', form.startDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateAll()) {
      return;
    }

    try {
      setLoading(true);
      if (editingExpo) {
        await api.put(`/expos/${editingExpo._id}`, {
          title: form.title,
          startDate: form.startDate,
          endDate: form.endDate,
          location: form.location,
          description: form.description,
          theme: form.theme,
        });
        showToast({ message: 'Expo updated successfully', type: 'success' });
      } else {
        await api.post('/expos', {
          title: form.title,
          startDate: form.startDate,
          endDate: form.endDate,
          location: form.location,
          description: form.description,
          theme: form.theme,
        });
        showToast({ message: 'Expo created successfully', type: 'success' });
      }
      setLoading(false);
      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (err) {
      setLoading(false);
      console.error('Expo operation error:', err);
      const action = editingExpo ? 'update' : 'create';
      setError(err?.response?.data?.message || `Failed to ${action} expo`);
      showToast({ message: err?.response?.data?.message || `Failed to ${action} expo`, type: 'error' });
    }
  };

  const isFormInvalid = Object.keys(errors).some((k) => errors[k]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editingExpo ? 'Edit Expo' : 'Create Expo'}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className={errors.title ? 'input-error' : ''} aria-invalid={!!errors.title} />
          {errors.title && <small className="field-error">{errors.title}</small>}

          <label>Start Date</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required className={errors.startDate ? 'input-error' : ''} aria-invalid={!!errors.startDate} />
          {errors.startDate && <small className="field-error">{errors.startDate}</small>}

          <label>End Date</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required className={errors.endDate ? 'input-error' : ''} aria-invalid={!!errors.endDate} />
          {errors.endDate && <small className="field-error">{errors.endDate}</small>}

          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} required className={errors.location ? 'input-error' : ''} aria-invalid={!!errors.location} />
          {errors.location && <small className="field-error">{errors.location}</small>}

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="button" className="auth-button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="auth-button" disabled={loading || isFormInvalid}>{loading ? (editingExpo ? 'Updating...' : 'Creating...') : (editingExpo ? 'Update Expo' : 'Create Expo')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExpoModal;