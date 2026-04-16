import React from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu({ 
  userData, 
  logout, 
  theme, 
  toggleTheme, 
  onClose 
}) {
  const navigate = useNavigate();
  if (!userData) return null;

  return (
    <div className="profile-menu-overlay">
      <div className="menu-header">
        <div className={`menu-avatar-large ${userData.isOwner ? 'owner-avatar' : ''}`}>
          {userData.picture ? (
            <img src={userData.picture} alt="" className="user-avatar-img" />
          ) : (
            userData.initials || '??'
          )}
        </div>
        <div className="menu-user-info">
          <span className="menu-user-name">{userData.name}</span>
          <span className="menu-user-email">{userData.email}</span>
        </div>
      </div>

      <div className="menu-body">
        <div className="theme-toggle-inline">
          <span className="inline-label">Display Mode</span>
          <button 
            className="compact-theme-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="menu-divider" />

        <div className="menu-group-label">Engineer Account</div>
        
        <div className="menu-item" onClick={() => { navigate('/profile', { state: { from: '/', fromLabel: 'Dashboard' } }); onClose(); }}>
          <User size={18} />
          <span>My Profile Dashboard</span>
        </div>

        <div className="menu-item" onClick={onClose}>
          <Settings size={18} />
          <span>Hardware Settings</span>
        </div>

        <div className="menu-divider" />
        
        <div className="menu-item" onClick={onClose}>
          <HelpCircle size={18} />
          <span>Hub Documentation</span>
        </div>

        <div className="menu-item logout" onClick={() => { logout(); onClose(); }}>
          <LogOut size={18} />
          <span>Sign Out Session</span>
        </div>
      </div>
    </div>
  );
}
