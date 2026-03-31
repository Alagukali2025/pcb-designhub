import { Search, User, Sun, Moon } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="app-header fade-in">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search rules, standards..." className="search-input" />
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
