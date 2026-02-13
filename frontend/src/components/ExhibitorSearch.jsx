import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

const ExhibitorSearch = () => {
  const [exhibitors, setExhibitors] = useState([]);
  const [filteredExhibitors, setFilteredExhibitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        const res = await api.get('/exhibitors/search');
        setExhibitors(res.data.exhibitors || []);

        // Extract unique categories
        const cats = [...new Set(res.data.exhibitors.flatMap(e => e.productsServices || []))];
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching exhibitors:', err);
        setError('Failed to load exhibitors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitors();
  }, []);

  useEffect(() => {
    let filtered = exhibitors;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.companyDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.productsServices && e.productsServices.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(e =>
        e.productsServices && e.productsServices.includes(selectedCategory)
      );
    }

    setFilteredExhibitors(filtered);
  }, [exhibitors, searchTerm, selectedCategory]);

  if (loading) return (
    <div className="dashboard-container">
      <p>Loading exhibitors...</p>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Exhibitor Search</h1>
      </div>
      <div className="dashboard-content">
        <div className="search-filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by company name, description, or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="exhibitor-results">
          {filteredExhibitors.length === 0 ? (
            <div className="dashboard-message">
              <p>No exhibitors found matching your criteria.</p>
            </div>
          ) : (
            <div className="exhibitor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredExhibitors.map((exhibitor) => (
                <div key={exhibitor._id} className="exhibitor-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#fff' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{exhibitor.companyName}</h3>
                  <p style={{ marginBottom: '8px' }}>{exhibitor.companyDescription}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Products/Services:</strong> {exhibitor.productsServices?.join(', ') || 'N/A'}</p>
                  <p style={{ marginBottom: '12px' }}><strong>Booth:</strong> {exhibitor.booth?.boothNumber || 'Not assigned'}</p>
                  <div className="exhibitor-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => window.open(`/exhibitor/${exhibitor._id}`, '_blank')}
                      style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => window.open(`/floor-plan/${exhibitor.expo._id}?booth=${exhibitor.booth?._id}`, '_blank')}
                      style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      View on Floor Plan
                    </button>
                    <button
                      onClick={() => window.open(`/messages?recipient=${exhibitor.exhibitor._id}`, '_blank')}
                      style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Contact Exhibitor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitorSearch;
