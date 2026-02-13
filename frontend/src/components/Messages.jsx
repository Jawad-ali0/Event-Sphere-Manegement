import './Dashboard.css';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';

const Messages = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ recipient: '', subject: '', content: '', messageType: '' });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/messages');
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        showToast({ message: 'Failed to load messages', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [showToast]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', form);
      setShowCompose(false);
      setForm({ recipient: '', subject: '', content: '', messageType: '' });
      // Refresh messages
      const res = await api.get('/messages');
      setMessages(res.data.messages || []);
      showToast({ message: 'Message sent successfully', type: 'success' });
    } catch (err) {
      console.error('Error sending message:', err);
      showToast({ message: 'Failed to send message', type: 'error' });
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      showToast({ message: 'Message deleted', type: 'success' });
    } catch (err) {
      console.error('Error deleting message:', err);
      showToast({ message: 'Failed to delete message', type: 'error' });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Messages</h1>
        <button onClick={() => setShowCompose(!showCompose)}>Compose</button>
      </div>
      <div className="dashboard-content">
        {showCompose && (
          <form onSubmit={handleSend} style={{ marginBottom: 20, border: '1px solid #eee', padding: 16 }}>
            <h3>Compose Message</h3>
            <label>Recipient ID</label>
            <input name="recipient" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} required />

            <label>Subject</label>
            <input name="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />

            <label>Content</label>
            <textarea name="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} required />

            <label>Message Type</label>
            <select name="messageType" value={form.messageType} onChange={(e) => setForm({ ...form, messageType: e.target.value })} required>
              <option value="">Select type</option>
              {user?.role === 'exhibitor' && (
                <>
                  <option value="exhibitor-to-organizer">To Organizer</option>
                  <option value="exhibitor-to-exhibitor">To Exhibitor</option>
                </>
              )}
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <option value="organizer-to-exhibitor">To Exhibitor</option>
              )}
            </select>

            <button type="submit">Send</button>
            <button type="button" onClick={() => setShowCompose(false)}>Cancel</button>
          </form>
        )}

        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div>
            {messages.map(msg => (
              <div key={msg._id} style={{ border: '1px solid #eee', padding: 16, marginBottom: 8, backgroundColor: msg.isRead ? '#f9f9f9' : '#fff' }}>
                <h4>{msg.subject}</h4>
                <p><strong>From:</strong> {msg.sender.firstName} {msg.sender.lastName}</p>
                <p><strong>To:</strong> {msg.recipient.firstName} {msg.recipient.lastName}</p>
                <p>{msg.content}</p>
                <small>{new Date(msg.createdAt).toLocaleString()}</small>
                {!msg.isRead && msg.recipient._id === user._id && (
                  <button onClick={() => handleMarkRead(msg._id)}>Mark as Read</button>
                )}
                {msg.sender._id === user._id && (
                  <button onClick={() => handleDelete(msg._id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
