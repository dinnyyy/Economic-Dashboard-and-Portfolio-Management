import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on component mount
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedAuth = localStorage.getItem('rememberMe');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.isAuthenticated && authData.timestamp) {
            // Check if the stored auth is still valid (24 hours)
            const now = new Date().getTime();
            const storedTime = new Date(authData.timestamp).getTime();
            const hoursDiff = (now - storedTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
              setIsAuthenticated(true);
            } else {
              // Clear expired authentication
              localStorage.removeItem('rememberMe');
            }
          }
        }
      } catch (error) {
        console.error('Error checking stored authentication:', error);
        localStorage.removeItem('rememberMe');
      }
      setIsLoading(false);
    };

    checkStoredAuth();
  }, []);

  const login = (rememberMe = false) => {
    setIsAuthenticated(true);
    
    if (rememberMe) {
      const authData = {
        isAuthenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('rememberMe', JSON.stringify(authData));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rememberMe');
  };

  const clearRememberMe = () => {
    localStorage.removeItem('rememberMe');
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
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
