import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Auth.css';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccess('Password reset email sent successfully! Please check your email inbox (and spam folder) for reset instructions.');
        setEmail(''); // Clear email field
      } else {
        setError(result.message || 'Failed to send reset email');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card forgot-password-card">
        <div className="auth-logo">EventSphere</div>
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="auth-subtitle forgot-password-subtitle">Enter your email to receive password reset instructions</p>

        {error && <div className="error-message forgot-password-message">{error}</div>}
        {success && <div className="success-message forgot-password-message">{success}</div>}

        <form onSubmit={handleRequestReset} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="forgot-password-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Sending Email...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer forgot-password-footer">
          Remember your password? <Link to="/login" className="forgot-password-link">Login here</Link>
        </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
