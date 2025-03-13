// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService } from '../services/authService';
import { tokenService } from '../utils/tokenService';

// Create the Auth Context
export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state based on stored tokens
  const initializeAuth = useCallback(async () => {
    console.log('Initializing authentication state...');
    setLoading(true);
    
    try {
      // Delay slightly to ensure localStorage is available (helps with some edge cases)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Checking for valid tokens...');
      // Check if we have a valid token
      if (tokenService.isAccessTokenValid()) {
        console.log('Access token is valid, getting user info');
        // Get user info from token
        const userInfo = tokenService.getUserInfo();
        if (userInfo) {
          console.log('Setting user from token:', userInfo.username);
          setUser(userInfo);
          
          console.log('User authenticated successfully from stored token');
          setLoading(false);
          return;
        } else {
          console.warn('Token valid but could not extract user info');
        }
      } else {
        console.log('Access token invalid or expired');
      }
      
      // Try refresh token if access token is invalid
      if (tokenService.isRefreshTokenValid()) {
        console.log('Attempting to refresh token...');
        try {
          // Try to refresh the token
          await authService.refreshToken();
          console.log('Token refreshed successfully');
          
          const userInfo = tokenService.getUserInfo();
          if (userInfo) {
            console.log('Setting user from refreshed token');
            setUser(userInfo);
            setLoading(false);
            return;
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          tokenService.clearTokens();
        }
      } else {
        console.log('No valid refresh token');
      }
      
      // If we got here, no valid tokens or refresh failed
      console.log('No valid authentication found, user is not logged in');
      setUser(null);
      tokenService.clearTokens();
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err);
      setUser(null);
      tokenService.clearTokens();
    } finally {
      console.log('Auth initialization completed, loading set to false');
      setLoading(false);
    }
  }, []);

  // Run once on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login for:', username);
      const data = await authService.login(username, password);
      console.log('Login successful, setting user state');
      
      // Ensure tokens are properly set
      if (data && data.accessToken) {
        tokenService.setTokens(data.accessToken, data.refreshToken);
      }
      
      // For Spring Boot, we'll use the roles from the response if available
      if (data && data.roles) {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles.map(role => {
            // Convert ROLE_XXX to XXX format if needed
            if (role.startsWith('ROLE_')) {
              return role.replace('ROLE_', '');
            }
            return role;
          })
        });
      } else {
        // Otherwise fallback to decoding the token
        const userInfo = tokenService.getUserInfo();
        if (userInfo) {
          setUser(userInfo);
        } else {
          throw new Error('Failed to extract user info from token');
        }
      }
      
      return data;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      return await authService.register(userData);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      tokenService.clearTokens();
      setLoading(false);
    }
  };

  // Set up a timer to refresh the token before it expires
  useEffect(() => {
    if (!user) return;

    const tokenExpirationTime = tokenService.getTokenExpirationTime();
    if (!tokenExpirationTime) return;

    // Calculate time until token expires (minus 1 minute buffer)
    const currentTime = Date.now();
    const timeUntilExpiration = tokenExpirationTime - currentTime - 60000;

    // If token expires in less than a minute, refresh it now
    if (timeUntilExpiration < 60000 && timeUntilExpiration > 0) {
      authService.refreshToken()
        .then(() => {
          const userInfo = tokenService.getUserInfo();
          setUser(userInfo);
        })
        .catch(() => {
          setUser(null);
        });
      return;
    }

    // Otherwise set a timer to refresh it before expiration
    const refreshTimer = setTimeout(async () => {
      try {
        await authService.refreshToken();
        const userInfo = tokenService.getUserInfo();
        setUser(userInfo);
      } catch (err) {
        setUser(null);
      }
    }, timeUntilExpiration);

    return () => clearTimeout(refreshTimer);
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user || !user.roles) return false;
    
    // Check for both formats (with or without ROLE_ prefix)
    return user.roles.includes(role) || user.roles.includes(`ROLE_${role}`);
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('ADMIN');
  }, [hasRole]);

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    hasRole,
    login,
    register,
    logout,
    refreshToken: authService.refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};