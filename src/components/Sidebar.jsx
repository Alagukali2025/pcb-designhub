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
        <div className="brand-chip" style={{ width: 'fit-content' }}>
          <div className="brand-chip-icon">
            <img src="/logo-new.png" alt="PCB RULES" />
          </div>
          <span className="brand-chip-wordmark">
            <span className="text-pcb-green">PCB</span>
            <span className="text-copper"> RULES</span>
          </span>
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
