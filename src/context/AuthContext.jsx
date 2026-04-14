import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('pcb_masterclass_user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const isOwnerEmail = (email) => email?.toLowerCase() === 'kalialagu201@gmail.com';

  const login = (userId) => {
    const isOwner = isOwnerEmail(userId);
    const user = {
      id: userId,
      name: isOwner ? 'Platform Owner' : userId, 
      initials: isOwner ? 'AD' : userId.substring(0, 2).toUpperCase(),
      loginTime: new Date().toISOString(),
      isOwner: isOwner
    };
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem('pcb_masterclass_user', JSON.stringify(user));
  };

  const loginWithGoogle = () => {
    const user = {
      id: 'google_user_' + Math.floor(Math.random() * 1000),
      name: 'Google Engineer',
      email: 'engineer@google.com',
      initials: 'GE',
      loginTime: new Date().toISOString(),
      authMethod: 'google'
    };
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem('pcb_masterclass_user', JSON.stringify(user));
  };

  const register = (data) => {
    const isOwner = isOwnerEmail(data.email);
    const user = {
      id: data.email,
      name: isOwner ? 'Platform Owner' : data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      initials: isOwner ? 'AD' : data.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      loginTime: new Date().toISOString(),
      isOwner: isOwner
    };
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem('pcb_masterclass_user', JSON.stringify(user));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('pcb_masterclass_user');
  };

  const value = {
    isLoggedIn,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout
  };



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
