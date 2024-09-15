import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, logout } from '../services/authService';

// Define the types for the context
interface AuthContextProps {
  isAuthenticated: boolean;
  userName: string | null;
  loginUser: (name: string, email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component to wrap the app
export const AuthProvider: React.FC<{children: any}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Check authentication status when the app starts
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const checkAuthentication = () => {
      if (userName) {
        setIsAuthenticated(true);
        setUserName(userName); // Assuming the name is stored in localStorage
      } else {
        setIsAuthenticated(false);
        setUserName(null);
      }
    };
    checkAuthentication();
  }, []);

  // Function to log in the user
  const loginUser = async (name: string, email: string) => {
    try {
      const response = await login(name, email);
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUserName(name);
        localStorage.setItem('userName', name); // Store userName in localStorage
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Function to log out the user
  const logoutUser = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserName(null);
      localStorage.removeItem('userName');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
