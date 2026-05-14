import { useState, useEffect, useRef } from 'react';
import { Search, User, Sun, Moon, Menu, X, BookOpen, Hash, ArrowRight, ShieldCheck, PanelLeftClose, PanelLeftOpen, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { useAuth } from '../context/AuthContext';
import { getIconForAvatarUrl } from '../data/constants';


export default function Header({ theme, toggleTheme, toggleSidebar, isSidebarOpen }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const { isLoggedIn, userData, logout } = useAuth();
  const [isIdentityVisible, setIsIdentityVisible] = useState(false);


  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsIdentityVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search/results on navigation
  useEffect(() => {
    setIsSearchExpanded(false);
    setIsResultsVisible(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    modulesData.forEach(module => {
      // 1. Match Module Title (Highest Priority)
      const titleMatch = module.title.toLowerCase().indexOf(lowerQuery);
      if (titleMatch !== -1) {
        results.push({
          type: 'module',
          moduleId: module.id,
          title: module.title,
          desc: module.desc,
          icon: module.icon,
          score: 100 - titleMatch
        });
      }

      // 2. Match Module Description
      if (module.desc.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'module',
          moduleId: module.id,
          title: module.title,
          desc: module.desc,
          icon: module.icon,
          score: 80
        });
      }

      // 3. Match Section Headings
      if (module.sections) {
        module.sections.forEach((section, index) => {
          const sectionText = typeof section === 'string' ? section : (section.heading || '');
          if (sectionText.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: 'topic',
              moduleId: module.id,
              moduleTitle: module.title,
              title: sectionText,
              sectionIndex: index,
              score: 70
            });
          }
        });
      }

      // 4. Expert Keywords
      const technicalKeywords = [
        { key: 'ipc', target: 'stackup', label: 'IPC Standards Reference' },
        { key: 'impedance', target: 'high_speed', label: 'Impedance Control & Solving' },
        { key: 'dfm', target: 'dfm_dft', label: 'Design for Manufacturing' },
        { key: 'gerber', target: 'pcb_output_system', label: 'Gerber & Fabrication Files' },
        { key: 'si/pi', target: 'si_pi', label: 'Signal & Power Integrity' }
      ];

      technicalKeywords.forEach(kw => {
        if (kw.key.includes(lowerQuery) && module.id === kw.target) {
          results.push({
            type: 'expert',
            moduleId: kw.target,
            moduleTitle: module.title,
            title: kw.label,
            score: 95
          });
        }
      });
    });

    // Deduplicate and Sort
    const uniqueResults = [];
    const seen = new Set();

    results
      .sort((a, b) => b.score - a.score)
      .forEach(res => {
        const key = `${res.moduleId}-${res.title}`;
        if (!seen.has(key)) {
          uniqueResults.push(res);
          seen.add(key);
        }
      });

    setSearchResults(uniqueResults.slice(0, 8));
    setIsResultsVisible(uniqueResults.length > 0);
  };

  const handleResultClick = (result) => {
    if (result.type === 'module' || result.type === 'expert') {
      navigate(`/module/${result.moduleId}`);
    } else {
      navigate(`/module/${result.moduleId}`, { 
        state: { scrollTo: result.sectionIndex } 
      });
    }
    setIsResultsVisible(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

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
      <div className={`header-left ${isSearchExpanded ? 'search-expanded' : ''}`}>
        <button 
          className="icon-btn menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        
        <div className="header-page-title">
          <span>{pageTitle}</span>
        </div>
        
        <div className={`search-bar ${isSearchExpanded ? 'expanded' : ''}`} ref={searchRef}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search rules, standards..." 
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery.length >= 2 && setIsResultsVisible(true)}
          />
          
          {isResultsVisible && (
            <div className="search-results-overlay glass-morphism-premium slide-up">
              {searchResults.length > 0 ? (
                <div className="search-results-list">
                  {searchResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-icon">
                        {result.type === 'module' ? <BookOpen size={16} /> : 
                         result.type === 'expert' ? <ShieldCheck size={16} className="text-accent" /> :
                         <Hash size={16} />}
                      </div>
                      <div className="result-info">
                        <div className="result-title">{result.title}</div>
                        <div className="result-meta">
                          {result.type === 'module' ? 'Main Module' : 
                           result.type === 'expert' ? `Expert Reference` :
                           `In ${result.moduleTitle}`}
                        </div>
                      </div>
                      <ArrowRight size={14} className="result-arrow" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">
                  No matching topics found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          <button 
            className="icon-btn mobile-search-close" 
            onClick={() => setIsSearchExpanded(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button 
          className="icon-btn search-bar-toggle" 
          onClick={() => setIsSearchExpanded(true)}
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
      
        <div className="header-actions">
          {/* Theme toggle removed from here - moved into Profile Menu for logged in users */}
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
