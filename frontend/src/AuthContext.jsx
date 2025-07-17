import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Check for stored authentication on component mount
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedAuth = localStorage.getItem('rememberMe');
        const storedUserId = localStorage.getItem('userId');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.isAuthenticated && authData.timestamp) {
            // Check if the stored auth is still valid (24 hours)
            const now = new Date().getTime();
            const storedTime = new Date(authData.timestamp).getTime();
            const hoursDiff = (now - storedTime) / (1000 * 60 * 60);
            if (hoursDiff < 24) {
              setIsAuthenticated(true);
              if (storedUserId) setUserId(parseInt(storedUserId));
            } else {
              // Clear expired authentication
              localStorage.removeItem('rememberMe');
              localStorage.removeItem('userId');
            }
          }
        }
      } catch (error) {
        console.error('Error checking stored authentication:', error);
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userId');
      }
      setIsLoading(false);
    };
    checkStoredAuth();
  }, []);

  const login = (userIdValue, rememberMe = false) => {
    setIsAuthenticated(true);
    setUserId(userIdValue);
    if (rememberMe) {
      const authData = {
        isAuthenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('rememberMe', JSON.stringify(authData));
      localStorage.setItem('userId', userIdValue);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userId');
  };

  const clearRememberMe = () => {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userId');
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      clearRememberMe,
      isLoading,
      userId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
