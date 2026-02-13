import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';

const FloorPlan = ({ expoId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const res = await api.get(`/booths/expo/${expoId}`);
        setBooths(res.data.booths || []);
      } catch (err) {
        console.error('Error fetching booths:', err);
        showToast({ message: 'Failed to load floor plan', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBooths();
  }, [expoId, showToast]);

  const handleReserve = async (boothId) => {
    try {
      await api.post(`/booths/${boothId}/reserve`);
      setBooths(prev => prev.map(b => b._id === boothId ? { ...b, status: 'reserved', exhibitor: user._id } : b));
      showToast({ message: 'Booth reserved successfully', type: 'success' });
    } catch (err) {
      console.error('Error reserving booth:', err);
      showToast({ message: err.response?.data?.message || 'Failed to reserve booth', type: 'error' });
    }
  };

  if (loading) return <p>Loading floor plan...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8, maxWidth: 800 }}>
      {booths.map(booth => (
        <div
          key={booth._id}
          style={{
            border: '1px solid #ccc',
            padding: 8,
            textAlign: 'center',
            backgroundColor: booth.status === 'available' ? 'lightgreen' : booth.status === 'reserved' ? 'yellow' : 'gray',
            cursor: booth.status === 'available' && user?.role === 'exhibitor' ? 'pointer' : 'default'
          }}
          onClick={() => booth.status === 'available' && user?.role === 'exhibitor' && handleReserve(booth._id)}
        >
          <p>{booth.boothNumber}</p>
          <small>${booth.price}</small>
          <br />
          <small>{booth.status}</small>
        </div>
      ))}
    </div>
  );
};

export default FloorPlan;
