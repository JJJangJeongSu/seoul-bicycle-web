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
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in debug mode
    if (API_CONFIG.debug) {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (API_CONFIG.debug) {
      console.error('[API Request Error]', error);
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
    // Log response in debug mode
    if (API_CONFIG.debug) {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Log error in debug mode
    if (API_CONFIG.debug) {
      console.error('[API Response Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
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
          console.error('Permission denied');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
          // Server error
          console.error('Server error occurred');
          break;

        default:
          console.error('API error:', error.message);
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
