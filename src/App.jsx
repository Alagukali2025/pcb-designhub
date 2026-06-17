import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import OnboardingModal from './components/OnboardingModal';
import AIBot from './components/AIBot';
import { DesignProvider } from './context/DesignContext';
import { useAuth } from './context/AuthContext';

// Lazy load route components
const Dashboard = lazy(() => import('./components/Dashboard'));
const ContentViewer = lazy(() => import('./components/ContentViewer'));
const Login = lazy(() => import('./components/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CreatePassword = lazy(() => import('./components/CreatePassword'));
const Profile = lazy(() => import('./components/Profile'));


// Simple fallback for route suspension
const RouteFallback = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '60vh',
    color: 'var(--text-tertiary)',
    fontSize: '0.9rem',
    fontWeight: 500
  }}>
    <div className="loading-dots">Initializing Module<span>.</span><span>.</span><span>.</span></div>
  </div>
);


function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Default open on desktop, closed on mobile
    return window.innerWidth > 1024;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { isLoggedIn, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();




  useEffect(() => {
    setIsFadingOut(true);
    setTimeout(() => setIsLoading(false), 800); // Wait for fade out animation
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle window resize to auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on mobile when location changes (topic clicked)
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const isLoginPage = location.pathname === '/login';
  const showDashboard = !isLoginPage;

  return (
    <DesignProvider>
      {(isLoading || authLoading) && <LoadingScreen isFadingOut={isFadingOut} />}
      
      {showDashboard ? (
        <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {isLoggedIn && !userData?.isOwner && !userData?.industry && <OnboardingModal />}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="main-content">
            <Header 
              theme={theme} 
              toggleTheme={toggleTheme} 
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
            <main className="page-content">
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/create-password" element={<CreatePassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/module/:id" element={<ContentViewer />} />
                </Routes>
              </Suspense>
              <Footer />
            </main>
          </div>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div className="sidebar-overlay" onClick={toggleSidebar}></div>
          )}
          {/* Global AI Bot — floats on every page */}
          <AIBot />
        </div>
      ) : (
        <div className="auth-fullscreen-layout">
          <Suspense fallback={<LoadingScreen isFadingOut={false} />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* Catch-all for unauthenticated users at / or other routes */}
              <Route path="*" element={<Login />} />
            </Routes>
          </Suspense>
        </div>
      )}
    </DesignProvider>
  );
}


export default App;
