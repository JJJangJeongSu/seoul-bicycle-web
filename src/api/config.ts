/// <reference types="vite/client" />
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Configuration } from '../../CodeGenerator/configuration';

export const BASE_URL = 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Extend Axios config to include metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Add a request interceptor to inject the token if it exists
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Metadata for duration calculation
    config.metadata = { startTime: new Date() };

    // Request Logging
    if (import.meta.env.DEV && import.meta.env.VITE_API_LOGGING !== 'false') {
      console.groupCollapsed(
        `%c➡️ ${config.method?.toUpperCase()} %c${config.url}`,
        'color: #3b82f6; font-weight: bold',
        'color: #10b981; font-weight: normal'
      );
      
      console.log('%cURL:', 'color: #8b5cf6', `${config.baseURL}${config.url}`);
      if (config.data) console.log('Body:', config.data);
      if (config.params) console.log('Params:', config.params);
      
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Logging
axiosInstance.interceptors.response.use(
  (response) => {
    const config = response.config as CustomAxiosRequestConfig;
    const duration = config.metadata ? new Date().getTime() - config.metadata.startTime.getTime() : 0;

    if (import.meta.env.DEV && import.meta.env.VITE_API_LOGGING !== 'false') {
      const statusColor = response.status < 300 ? '#10b981' : response.status < 400 ? '#f59e0b' : '#ef4444';
      
      console.groupCollapsed(
        `%c✅ ${response.status} %c${config.method?.toUpperCase()} %c${config.url}%c (${duration}ms)`,
        `color: ${statusColor}`,
        'color: #3b82f6',
        'color: #10b981',
        'color: #6b7280'
      );
      
      console.log('Response Data:', response.data);
      console.groupEnd();
    }
    return response;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV && import.meta.env.VITE_API_LOGGING !== 'false') {
      const status = error.response?.status || 'ERR';
      const config = error.config as CustomAxiosRequestConfig;
      
      console.groupCollapsed(
        `%c❌ ${status} %c${config?.method?.toUpperCase()} %c${config?.url}`,
        'color: #ef4444',
        'color: #3b82f6',
        'color: #6b7280'
      );
      
      console.error('Error Message:', error.message);
      if (error.response) {
        console.error('Response Data:', error.response.data);
      }
      console.groupEnd();
    }
    return Promise.reject(error);
  }
);

export const apiConfig = new Configuration({
  basePath: BASE_URL,
  baseOptions: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
