import { Link, useLocation } from 'react-router-dom';
import { Home, ShieldCheck, LayoutGrid } from 'lucide-react';
import { modulesData } from '../data/modules';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { userData } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo-container" style={{ width: '40px', height: '44px', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))' }}>
            <img src="/logo-new.png" alt="PCB RULES Logo" style={{ width: '135%', height: '135%', objectFit: 'cover', minWidth: '135%', minHeight: '135%' }} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-title">
              <span className="text-pcb-green">PCB</span> <span className="text-copper">RULES</span>
            </span>
            <span className="brand-subtitle">Engineering</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </li>

          {userData?.isOwner && (
            <li>
              <Link to="/admin" className={`nav-link admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
              </Link>
            </li>
          )}

          {modulesData.map(mod => {
            const IconComponent = mod.icon;
            const isActive = location.pathname === `/module/${mod.id}`;
            return (
              <li key={mod.id}>
                <Link to={`/module/${mod.id}`} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <IconComponent size={18} />
                  <span>{mod.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
