import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Cpu } from 'lucide-react';

export default function CreatePassword() {
  const { userData, needsPasswordSetup, completePasswordSetup, logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password requirements
  const requirements = [
    { label: 'Minimum 8 characters', met: password.length >= 8 },
    { label: 'At least one number', met: /\d/.test(password) },
    { label: 'At least one special char', met: /[!@#$%^&*]/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && password.length > 0 }
  ];

  const isFormValid = requirements.every(r => r.met);

  useEffect(() => {
    // If user is logged in but doesn't need setup, or not logged in, redirect
    if (!needsPasswordSetup && userData) {
      navigate('/');
    }
  }, [needsPasswordSetup, userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const result = await completePasswordSetup(password);
      if (result.success) {
        // Success! The guard in App.jsx or the effect above will handle redirect
        navigate('/');
      } else {
        setError(result.error || 'Failed to set password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="setup-container">
        <div className="setup-card glass-morphism">
          <p>Please log in with Google to continue setup.</p>
          <button onClick={() => navigate('/login')} className="auth-main-btn">BACK TO LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-container fade-in">
      <div className="setup-card-wrapper">
        <div className="setup-header">
          <div className="setup-logo">
            <Cpu size={32} className="logo-icon-svg" />
            <h1 className="setup-title">SECURE ACCOUNT SETUP</h1>
          </div>
        </div>

        <div className="auth-card glass-morphism">
          <div className="auth-card-inner">
            <div className="setup-intro">
              <ShieldCheck size={40} className="setup-icon" />
              <h2>Enable Hybrid Authentication</h2>
              <p>To ensure secure access to the engineering hub, please create a manual password for your account <strong>{userData.email}</strong>.</p>
            </div>

            <form onSubmit={handleSubmit} className="setup-form">
              <div className="form-group">
                <label>NEW PASSWORD</label>
                <div className="input-field">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>CONFIRM PASSWORD</label>
                <div className="input-field">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Verify your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="password-checklist">
                {requirements.map((req, i) => (
                  <div key={i} className={`checklist-item ${req.met ? 'met' : ''}`}>
                    {req.met ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>

              {error && <div className="setup-error">{error}</div>}

              <button 
                type="submit" 
                className="auth-main-btn" 
                disabled={!isFormValid || loading}
              >
                <span>{loading ? 'SECURING ACCOUNT...' : 'COMPLETE SETUP'}</span>
                <ArrowRight size={20} />
              </button>
              
              <button 
                type="button" 
                className="auth-secondary-btn"
                onClick={() => logout()}
              >
                SIGN OUT & SETUP LATER
              </button>
            </form>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .setup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, rgba(0, 243, 255, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(157, 0, 255, 0.05), transparent);
          padding: 20px;
        }
        .setup-card-wrapper {
          width: 100%;
          max-width: 480px;
        }
        .setup-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .setup-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .setup-title {
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.2rem;
          font-size: 1.2rem;
          color: var(--text-primary);
        }
        .setup-intro {
          text-align: center;
          margin-bottom: 2rem;
        }
        .setup-icon {
          color: #00f3ff;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(0, 243, 255, 0.3));
        }
        .setup-intro h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        .setup-intro p {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
        }
        .setup-intro strong {
          color: #00f3ff;
        }
        .password-checklist {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .checklist-item.met {
          color: #10b981;
        }
        .setup-error {
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid #ef4444;
          color: #ef4444;
          padding: 0.75rem;
          font-size: 0.9rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        .auth-secondary-btn {
          width: 100%;
          margin-top: 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .auth-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
      `}} />
    </div>
  );
}
