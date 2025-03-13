// utils/tokenService.js
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenService = {
  // Save tokens to localStorage
  setTokens(accessToken, refreshToken) {
    if (accessToken) {
      // Remove "Bearer " if present
      const token = accessToken.startsWith('Bearer ') 
        ? accessToken.substring(7) 
        : accessToken;
        
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Clear tokens from localStorage
  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Check if token is in valid JWT format
  isValidJwtFormat(token) {
    if (!token) return false;
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  },

  // Check if access token is valid
  isAccessTokenValid() {
    const token = this.getAccessToken();
    if (!token || !this.isValidJwtFormat(token)) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Invalid access token:', error);
      return false;
    }
  },

  // Check if refresh token is valid
  isRefreshTokenValid() {
    const token = this.getRefreshToken();
    if (!token || !this.isValidJwtFormat(token)) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Invalid refresh token:', error);
      return false;
    }
  },

  // Get user info from token
  getUserInfo() {
    const token = this.getAccessToken();
    if (!token || !this.isValidJwtFormat(token)) return null;

    try {
      const decoded = jwtDecode(token);
      
      // Extract roles from the token claims
      // Spring Security might include roles in different formats
      let roles = [];
      
      if (decoded.roles) {
        // Handle array format
        if (Array.isArray(decoded.roles)) {
          roles = decoded.roles;
        } 
        // Handle string format (comma-separated)
        else if (typeof decoded.roles === 'string') {
          roles = decoded.roles.split(',').map(r => r.trim());
        }
      } else if (decoded.authorities) {
        // Some Spring implementations use "authorities" claim
        if (Array.isArray(decoded.authorities)) {
          roles = decoded.authorities;
        } else if (typeof decoded.authorities === 'string') {
          roles = decoded.authorities.split(',').map(r => r.trim());
        }
      } else if (decoded.scope) {
        // OAuth2 format sometimes uses "scope"
        if (typeof decoded.scope === 'string') {
          roles = decoded.scope.split(' ');
        }
      }
      
      // Map the Spring roles to our app roles
      // ROLE_ADMIN -> ADMIN, ROLE_USER -> USER, etc.
      const mappedRoles = roles.map(role => {
        // Check if role is an object with an "authority" property
        if (typeof role === 'object' && role.authority) {
          role = role.authority;
        }
        
        if (typeof role === 'string' && role.startsWith('ROLE_')) {
          return role.replace('ROLE_', '');
        }
        return role;
      });
      
      return {
        id: decoded.userId || decoded.id || decoded.sub,
        username: decoded.username || decoded.sub,
        email: decoded.email || '',
        roles: mappedRoles,
        exp: decoded.exp
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Get token expiration time
  getTokenExpirationTime() {
    const token = this.getAccessToken();
    if (!token || !this.isValidJwtFormat(token)) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }
};