import { useState, useEffect, useRef } from 'react';
import { User, Sun, Moon, ShieldCheck, PanelLeftClose, PanelLeftOpen, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { useAuth } from '../context/AuthContext';
import { getIconForAvatarUrl } from '../data/constants';


export default function Header({ theme, toggleTheme, toggleSidebar, isSidebarOpen }) {
  const profileRef = useRef(null);
  const location = useLocation();
  const { isLoggedIn, userData, logout } = useAuth();
  const [isIdentityVisible, setIsIdentityVisible] = useState(false);

  // Close profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsIdentityVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname === '/admin') return 'Admin Panel';
    if (location.pathname === '/profile') return 'User Profile';
    if (location.pathname === '/create-password') return 'Security Setup';
    
    if (location.pathname.startsWith('/module/')) {
      const moduleId = location.pathname.split('/').pop();
      const module = modulesData.find(m => m.id === moduleId);
      return module ? module.title : 'Module View';
    }
    
    return 'Dashboard';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="app-header fade-in">
      <div className="header-left">
        <button 
          className="icon-btn menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        {/* Glass chip brand — visible only when sidebar is collapsed */}
        {!isSidebarOpen ? (
          <div className="brand-chip">
            <div className="brand-chip-icon">
              <img src="/logo-new.png" alt="PCB RULES" />
            </div>
            <span className="brand-chip-wordmark">
              <span className="text-pcb-green">PCB</span>
              <span className="text-copper"> RULES</span>
            </span>
          </div>
        ) : (
          <div className="header-page-title">
            <span>{pageTitle}</span>
          </div>
        )}
      </div>
      
      <div className="header-actions">
        {/* Theme toggle for logged-out users */}
        {!isLoggedIn && (
          <button 
            className="icon-btn theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        {isLoggedIn ? (
          <div className="header-user-controls">
            <div className="user-profile-nav" ref={profileRef}>
              <div 
                className={`user-avatar ${userData?.isOwner ? 'owner-avatar' : ''} clickable`} 
                title={`Account: ${userData?.name}`}
                onClick={() => setIsIdentityVisible(!isIdentityVisible)}
              >
                {(() => {
                  const iconLook = getIconForAvatarUrl(userData?.picture);
                  if (iconLook) {
                    const Icon = iconLook.icon;
                    return (
                      <div className="branded-icon-wrapper small">
                        <Icon size={20} color="rgba(255,255,255,0.04)" />
                        <span className="branded-initials" style={{ color: '#fff' }}>{userData?.initials}</span>
                      </div>
                    );
                  }
                  if (userData?.picture) {
                    return <img src={userData.picture} alt="" className="user-avatar-img" />;
                  }
                  return userData?.initials || <User size={20} />;
                })()}
                
                {userData?.isOwner && (
                  <div className="owner-badge-overlay">
                    <ShieldCheck size={12} fill="currentColor" />
                  </div>
                )}
              </div>

              {isIdentityVisible && (
                <div className="identity-popup glass-morphism fade-in">
                  <div className="identity-email">{userData?.email}</div>
                </div>
              )}
            </div>

            <Link to="/profile" className="icon-btn" title="Settings">
              <Settings size={20} />
            </Link>

            <button 
              className="icon-btn theme-toggle" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              className="icon-btn logout-header-btn" 
              onClick={logout}
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-btn-header">
            <User size={16} />
            <span>SIGN IN</span>
          </Link>
        )}
      </div>

    </header>
  );
}
