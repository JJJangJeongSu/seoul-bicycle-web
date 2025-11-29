import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';

/**
 * API Client
 *
 * Axios instance with request/response interceptors
 * Handles authentication, error handling, and logging
 */

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 *
 * Adds authentication token to requests
 * Logs requests in debug mode
 */
// Extended request config to include start time
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

/**
 * Request Interceptor
 *
 * Adds authentication token to requests
 * Logs requests in debug mode
 */
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add authentication token if available
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add start time for duration calculation
    config.metadata = { startTime: Date.now() };

    // Log request in debug mode
    if (API_CONFIG.debug) {
      const method = config.method?.toUpperCase();
      const url = config.url;
      
      console.groupCollapsed(
        `%c🚀 [REQUEST] ${method} ${url}`, 
        'color: #3b82f6; font-weight: bold; font-size: 12px;'
      );
      console.log('%cHeaders:', 'color: #9ca3af; font-weight: bold;', config.headers);
      if (config.data) {
        console.log('%cBody:', 'color: #9ca3af; font-weight: bold;', config.data);
      }
      console.log('%cConfig:', 'color: #9ca3af; font-weight: bold;', config);
      console.groupEnd();
    }

    return config;
  },
  (error: AxiosError) => {
    if (API_CONFIG.debug) {
      console.error('❌ [REQUEST ERROR]', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Handles common response scenarios
 * Logs responses in debug mode
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as ExtendedAxiosRequestConfig;
    const duration = config.metadata ? Date.now() - config.metadata.startTime : 0;

    // Log response in debug mode
    if (API_CONFIG.debug) {
      const status = response.status;
      const url = response.config.url;
      const method = response.config.method?.toUpperCase();
      
      console.groupCollapsed(
        `%c✅ [RESPONSE] ${status} ${method} ${url} (%c${duration}ms%c)`, 
        'color: #10b981; font-weight: bold; font-size: 12px;',
        'color: #f59e0b; font-weight: bold;',
        'color: #10b981; font-weight: bold; font-size: 12px;'
      );
      console.log('%cData:', 'color: #9ca3af; font-weight: bold;', response.data);
      console.log('%cHeaders:', 'color: #9ca3af; font-weight: bold;', response.headers);
      console.groupEnd();
    }

    return response;
  },
  (error: AxiosError) => {
    const config = error.config as ExtendedAxiosRequestConfig;
    const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0;

    // Log error in debug mode
    if (API_CONFIG.debug) {
      const status = error.response?.status || 'UNKNOWN';
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();

      console.groupCollapsed(
        `%c❌ [ERROR] ${status} ${method} ${url} (%c${duration}ms%c)`, 
        'color: #ef4444; font-weight: bold; font-size: 12px;',
        'color: #f59e0b; font-weight: bold;',
        'color: #ef4444; font-weight: bold; font-size: 12px;'
      );
      console.log('%cMessage:', 'color: #ef4444; font-weight: bold;', error.message);
      if (error.response) {
        console.log('%cResponse Data:', 'color: #9ca3af; font-weight: bold;', error.response.data);
        console.log('%cResponse Headers:', 'color: #9ca3af; font-weight: bold;', error.response.headers);
      }
      console.log('%cStack:', 'color: #9ca3af;', error.stack);
      console.groupEnd();
    }

    // Handle common error scenarios
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('accessToken');
          window.dispatchEvent(new CustomEvent('auth:logout'));
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.warn('Permission denied for:', error.config?.url);
          break;

        case 404:
          // Not found
          console.warn('Resource not found:', error.config?.url);
          break;

        case 500:
          // Server error
          console.error('Server error occurred');
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server');
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to set auth token
 */
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

/**
 * Helper function to get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}
