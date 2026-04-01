import { Search, User, Sun, Moon, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme, toggleSidebar, isSidebarOpen }) {
  return (
    <header className="app-header fade-in">
      <div className="header-left">
        <button 
          className="icon-btn menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search rules, standards..." className="search-input" />
        </div>
      </div>
      
      <div className="header-actions">
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="user-avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
