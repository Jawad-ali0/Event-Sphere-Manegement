import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

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
        // Check if it's development mode with Ethereal Email preview
        if (result.data?.isDevelopment && result.data?.previewUrl) {
          // Development mode: Email sent via Ethereal, show preview URL
          setResetToken(result.data.resetToken || '');
          setResetUrl(result.data.resetUrl || '');
          setPreviewUrl(result.data.previewUrl);
          setSuccess('Password reset email sent successfully! (Development Mode - Using Ethereal Email)');
        } else if (result.data?.resetToken || result.data?.isDevelopment) {
          // Fallback: Token returned but email sending failed or not configured
          setResetToken(result.data.resetToken || '');
          setResetUrl(result.data.resetUrl || '');
          setPreviewUrl(result.data.previewUrl || '');

          // Show success message even if email failed, since token is available
          const message = result.data.message || 'Password reset token generated. Use the information below to reset your password.';
          setSuccess(message);
          // Clear any error if token is available
          setError('');
        } else {
          // Production mode: Email was sent via configured SMTP
          setSuccess('Password reset email sent successfully! Please check your email inbox (including spam folder) for the reset link. The link will expire in 10 minutes.');
          setResetToken(''); // Clear any previous token
          setResetUrl(''); // Clear any previous URL
          setPreviewUrl('');
        }
        setEmail(''); // Clear email field
      } else {
        // Only show error if no token is available
        if (result.data?.resetToken) {
          // Token available, show success with token
          setResetToken(result.data.resetToken);
          setResetUrl(result.data.resetUrl || '');
          setPreviewUrl(result.data.previewUrl || '');
          setSuccess(result.data.message || 'Password reset token generated. Use the information below to reset your password.');
          setError(''); // Clear error since we have token
        } else {
          // No token, show error
          setError(result.message || 'Failed to send reset email');
          setResetToken(''); // Clear token on error
          setResetUrl(''); // Clear URL on error
          setPreviewUrl('');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      setResetToken(''); // Clear token on error
      setResetUrl(''); // Clear URL on error
      setPreviewUrl(''); // Clear preview URL on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card forgot-password-card">
        <div className="auth-logo">EventSphere</div>
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="auth-subtitle forgot-password-subtitle">Enter your email to receive password reset instructions</p>

        {error && <div className="error-message forgot-password-message">{error}</div>}
        {success && <div className="success-message forgot-password-message">{success}</div>}

        {/* Development Mode: Show email preview URL and reset token */}
        {(previewUrl || resetToken) && (
          <div className="token-info">
            {previewUrl ? (
              <>
                <p className="token-title">📧 Development Mode - Email Sent via Ethereal Email</p>
                <p className="token-description">Email has been sent! Click the preview link below to view the email:</p>
                
                <p><strong>📬 Email Preview URL:</strong></p>
                <a href={previewUrl} className="token-link" target="_blank" rel="noopener noreferrer" style={{ 
                  display: 'block', 
                  padding: '12px', 
                  background: '#667eea', 
                  color: 'white', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  margin: '10px 0',
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>
                  👆 Click here to view the email
                </a>
                <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>{previewUrl}</code>
              </>
            ) : (
              <>
                <p className="token-title">🔧 Development Mode - Reset Token Generated</p>
                <p className="token-description">Email service is not configured. Use the information below to reset your password:</p>
              </>
            )}
            
            {resetToken && (
              <>
                <p style={{ marginTop: '15px' }}><strong>Reset URL:</strong></p>
                <code>{resetUrl || `http://localhost:5173/reset-password/${resetToken}`}</code>
                
                <p style={{ marginTop: '10px' }}><strong>Reset Token:</strong></p>
                <code>{resetToken}</code>
                
                <p className="token-url">
                  <strong>Click here to reset password:</strong><br />
                  <a href={resetUrl || `http://localhost:5173/reset-password/${resetToken}`} className="token-link" target="_blank" rel="noopener noreferrer">
                    {resetUrl || `http://localhost:5173/reset-password/${resetToken}`}
                  </a>
                </p>
              </>
            )}
            
            <p className="token-note">
              <strong>Note:</strong> {previewUrl 
                ? 'This is a test email service. In production, configure SMTP_EMAIL and SMTP_PASSWORD in backend/.env file to send real emails.'
                : 'In production, configure SMTP_EMAIL and SMTP_PASSWORD in backend/.env file to send emails automatically.'}
            </p>
          </div>
        )}

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
            {loading ? 'Sending Email...' : 'Send Password Reset Email'}
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
