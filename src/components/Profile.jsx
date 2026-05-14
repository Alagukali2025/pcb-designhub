import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Factory, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Save,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Bell,
  Trash2,
  ShieldQuestion
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { INDUSTRIAL_SECTORS } from '../data/constants';

export default function Profile() {
  const location = useLocation();
  const { userData, logout, updateProfileData, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    industry: 'Aerospace'
  });

  const [notifSettings, setNotifSettings] = useState({
    newModules: true,
    securityAlerts: true
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.name || '',
        phone: userData.phone || '',
        industry: userData.industry || 'Aerospace'
      });
    }
  }, [userData]);

  // Determine where to go back to
  const backPath = location.state?.from || '/';
  const backLabel = location.state?.fromLabel || 'Dashboard';

  if (!isLoggedIn || !userData) {
    return (
      <div className="profile-container empty">
        <ShieldAlert size={48} className="warning-icon" />
        <h2>Authentication Required</h2>
        <p>Please sign in to view and manage your profile.</p>
        <button className="auth-main-btn" onClick={() => navigate('/login')}>
          <span>GO TO LOGIN</span>
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaveStatus(null);
    setIsSaving(true);
    const result = await updateProfileData(formData);
    
    if (result.success) {
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
    }
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "CRITICAL ACTION: Are you absolutely sure you want to delete your account? \n\nThis will permanently erase all your data, progress, and settings. This action cannot be undone."
    );
    if (confirmed) {
      console.log('🚮 Account deletion requested');
      // Logic for deletion would go here
      alert("In this demo version, account deletion is logged but not executed on the server.");
    }
  };

  return (
    <div className="profile-dashboard fade-in">
      {/* Back Navigation */}
      <button className="profile-back-btn" onClick={() => navigate(backPath)}>
        <ArrowLeft size={18} />
        <span>Back to {backLabel}</span>
      </button>
      {/* Header Info */}
      <div className="profile-hero glass-morphism">
        <div className={`profile-avatar-large ${userData.isOwner ? 'owner-avatar' : ''}`}>
          {userData.picture ? (
            <img src={userData.picture} alt="" className="avatar-img" />
          ) : (
            userData.initials || '??'
          )}
          {userData.isOwner && (
            <div className="owner-badge-badge">
              <ShieldCheck size={18} />
              <span>PLATFORM OWNER</span>
            </div>
          )}
        </div>
        <div className="profile-hero-info">
          <h1>{userData.name}</h1>
          <p className="profile-email-sub">
            <Mail size={14} />
            {userData.email}
          </p>
          <div className="profile-badges">
            <span className="pill-badge tech">ENGINEER</span>
            {userData.authMethod === 'google' && (
              <span className="pill-badge google">
                <ShieldCheck size={12} /> Google Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        {/* Main Details */}
        <div className="profile-section glass-morphism">
          <div className="section-header">
            <h2>Professional Identity</h2>
            {!isEditing ? (
              <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>Edit Details</button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="form-item">
              <label>FULL DISPLAY NAME</label>
              <div className={`input-wrap ${!isEditing ? 'readonly' : ''}`}>
                <User size={18} />
                <input 
                  type="text" 
                  value={formData.full_name} 
                  readOnly={!isEditing}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
            </div>

            <div className="form-item">
              <label>EMAIL ADDRESS (UNMODIFIABLE)</label>
              <div className="input-wrap readonly">
                <Mail size={18} />
                <input type="email" value={userData.email} readOnly />
                <Lock size={14} className="lock-icon" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-item">
                <label>PHONE NUMBER</label>
                <div className={`input-wrap ${!isEditing ? 'readonly' : ''}`}>
                  <Phone size={18} />
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone} 
                    readOnly={!isEditing}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-item">
                <label>INDUSTRIAL SECTOR</label>
                <div className={`input-wrap ${!isEditing ? 'readonly' : ''}`}>
                  <Factory size={18} />
                  {isEditing ? (
                    <select 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    >
                      {INDUSTRIAL_SECTORS.map((sector) => (
                        <option key={sector.id} value={sector.id}>{sector.title}</option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" value={formData.industry} readOnly />
                  )}
                </div>
              </div>
            </div>

            {saveStatus === 'success' && (
              <div className="alert-box success slide-up">
                <CheckCircle2 size={18} />
                <span>Profile synchronization successful.</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="alert-box error slide-up">
                <AlertCircle size={18} />
                <span>Sync failed. Please check connection.</span>
              </div>
            )}
          </div>
        </div>

        {/* Security / Sidebar details */}
        <div className="profile-sidebar">
          <div className="profile-section glass-morphism security-card">
            <div className="section-header">
              <div className="title-with-icon">
                <Lock size={20} />
                <h2>Security & Access</h2>
              </div>
            </div>
            
            <div className="security-status">
              <button 
                className="security-action-btn"
                onClick={() => navigate('/create-password')}
              >
                {userData.hasPassword ? 'UPDATE MANUAL PASSWORD' : 'SET UP MANUAL PASSWORD'}
                <ChevronRight size={16} />
              </button>
            </div>

            <p className="security-notice">
              Administrative functions are locked behind your verified hardware session.
            </p>
          </div>

          <button className="profile-logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* New Professional Sections */}
      <div className="profile-content-grid" style={{ marginTop: '2rem' }}>
        {/* Notifications */}
        <div className="profile-section glass-morphism">
          <div className="section-header">
            <div className="title-with-icon">
              <Bell size={20} />
              <h2>Noise Control (Notifications)</h2>
            </div>
          </div>
          
          <div className="notification-list">
            <div className="notif-item">
              <div className="notif-info">
                <span className="notif-label">New Module Releases</span>
                <p className="notif-desc">Get notified when we add new technical PCB design content.</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notifSettings.newModules}
                  onChange={() => setNotifSettings(prev => ({...prev, newModules: !prev.newModules}))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notif-item">
              <div className="notif-info">
                <span className="notif-label">Security Alerts</span>
                <p className="notif-desc">Important notifications about your account access and safety.</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notifSettings.securityAlerts}
                  onChange={() => setNotifSettings(prev => ({...prev, securityAlerts: !prev.securityAlerts}))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="profile-section glass-morphism danger-zone-section">
          <div className="section-header">
            <div className="title-with-icon destructive">
              <ShieldQuestion size={20} />
              <h2>The Danger Zone</h2>
            </div>
          </div>
          
          <div className="danger-content">
            <p className="danger-notice">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="delete-account-btn" onClick={handleDeleteAccount}>
              <Trash2 size={18} />
              <span>PERMANENTLY DELETE ACCOUNT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
