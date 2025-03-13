// services/authService.js
import axiosInstance from '../utils/axiosConfig';
import { tokenService } from '../utils/tokenService';

export const authService = {
  // Login user
  async login(username, password) {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens
      tokenService.setTokens(accessToken, refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      
      // For registration, we'll immediately log in the user afterward
      if (response.status === 200 || response.status === 201) {
        const loginResponse = await this.login(userData.username, userData.password);
        return loginResponse;
      }
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Store new tokens
      tokenService.setTokens(accessToken, newRefreshToken || refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenService.clearTokens();
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      
      if (accessToken || refreshToken) {
        const headers = {
          'Authorization': `Bearer ${accessToken}`
        };
        
        if (refreshToken) {
          headers['X-Refresh-Token'] = refreshToken;
        }
        
        await axiosInstance.post('/auth/logout', {}, { headers });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens on logout
      tokenService.clearTokens();
    }
  },

  // Get current user info (if your backend supports it)
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};