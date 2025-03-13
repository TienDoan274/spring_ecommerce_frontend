// utils/axiosConfig.js
import axios from 'axios';
import { tokenService } from './tokenService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8070/api';

// For debugging - remove in production
console.log('API Base URL:', BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for potential network issues
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      // Make sure we don't add "Bearer " if it's already there
      const tokenValue = accessToken.startsWith('Bearer ') 
        ? accessToken 
        : `Bearer ${accessToken}`;
        
      config.headers['Authorization'] = tokenValue;
    }
    
    // For debugging - remove in production
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorResponse = error.response;
    
    // For debugging - remove in production
    console.error('API Error:', {
      url: originalRequest?.url,
      status: errorResponse?.status,
      data: errorResponse?.data
    });
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (errorResponse?.status === 401 && !originalRequest._retry) {
      // Check if we have a refresh token
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken || !tokenService.isValidJwtFormat(refreshToken)) {
        // If no valid refresh token, clear tokens and redirect to login
        tokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Call refresh token endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken: refreshToken
        });
        
        if (response.data.accessToken) {
          // Store the new tokens
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken || refreshToken;
          
          tokenService.setTokens(newAccessToken, newRefreshToken);
          
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Process the queue with the new token
          processQueue(null, newAccessToken);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          processQueue(error);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh token is invalid, clear tokens
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError);
        tokenService.clearTokens();
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // If error is 403 (Forbidden), this might be a permissions issue
    if (errorResponse?.status === 403) {
      console.warn('Access forbidden. This might be a permissions issue.');
      // We don't automatically redirect here as it might just be a forbidden resource
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;