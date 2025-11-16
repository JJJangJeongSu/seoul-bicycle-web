import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';

/**
 * API Client
 *
 * Axios instance with request/response interceptors
 * Handles authentication, error handling, and rich logging
 */

// Request ID generator for tracking
let requestCounter = 0;
const generateRequestId = (): string => {
  requestCounter = (requestCounter + 1) % 10000;
  return `REQ-${Date.now()}-${requestCounter.toString().padStart(4, '0')}`;
};

// Rich logger utility with styled console output
const logger = {
  request: (requestId: string, config: InternalAxiosRequestConfig) => {
    if (!API_CONFIG.isDevelopment && !API_CONFIG.debug) return;

    const timestamp = new Date().toISOString();
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;

    console.group(
      `%c🚀 API Request [${requestId}]`,
      'color: #4CAF50; font-weight: bold; font-size: 12px;'
    );

    console.log('%c⏰ Timestamp:', 'color: #9E9E9E; font-weight: bold;', timestamp);
    console.log('%c🔧 Method:', 'color: #2196F3; font-weight: bold;', method);
    console.log('%c🌐 URL:', 'color: #2196F3; font-weight: bold;', url);

    if (config.params) {
      console.log('%c🔍 Query Params:', 'color: #FF9800; font-weight: bold;', config.params);
    }

    if (config.headers) {
      const sanitizedHeaders = { ...config.headers };
      // Mask sensitive information
      if (sanitizedHeaders.Authorization) {
        const authValue = String(sanitizedHeaders.Authorization);
        sanitizedHeaders.Authorization = authValue.substring(0, 10) + '...' + '***MASKED***';
      }
      console.log('%c📋 Headers:', 'color: #9C27B0; font-weight: bold;', sanitizedHeaders);
    }

    if (config.data) {
      const dataStr = JSON.stringify(config.data);
      const truncated = dataStr.length > 1000;
      console.log(
        '%c📦 Request Body:',
        'color: #00BCD4; font-weight: bold;',
        truncated ? `${dataStr.substring(0, 1000)}... (truncated, ${dataStr.length} chars total)` : config.data
      );
    }

    console.log('%c⏱️ Timeout:', 'color: #9E9E9E; font-weight: bold;', `${config.timeout}ms`);
    console.groupEnd();
  },

  response: (requestId: string, response: AxiosResponse, duration: number) => {
    if (!API_CONFIG.isDevelopment && !API_CONFIG.debug) return;

    const timestamp = new Date().toISOString();
    const status = response.status;
    const statusColor = status >= 200 && status < 300 ? '#4CAF50' : '#FF9800';

    console.group(
      `%c✅ API Response [${requestId}]`,
      `color: ${statusColor}; font-weight: bold; font-size: 12px;`
    );

    console.log('%c⏰ Timestamp:', 'color: #9E9E9E; font-weight: bold;', timestamp);
    console.log('%c📊 Status:', `color: ${statusColor}; font-weight: bold;`, `${status} ${response.statusText}`);
    console.log('%c⚡ Duration:', 'color: #E91E63; font-weight: bold;', `${duration}ms`);
    console.log('%c🌐 URL:', 'color: #2196F3; font-weight: bold;', response.config.url);

    if (response.headers) {
      console.log('%c📋 Response Headers:', 'color: #9C27B0; font-weight: bold;', response.headers);
    }

    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      const dataSize = new Blob([dataStr]).size;
      const sizeStr = dataSize > 1024
        ? `${(dataSize / 1024).toFixed(2)} KB`
        : `${dataSize} bytes`;

      console.log('%c📦 Response Size:', 'color: #607D8B; font-weight: bold;', sizeStr);

      const truncated = dataStr.length > 1000;
      console.log(
        '%c📥 Response Data:',
        'color: #00BCD4; font-weight: bold;',
        truncated ? `${dataStr.substring(0, 1000)}... (truncated, ${dataStr.length} chars total)` : response.data
      );
    }

    console.groupEnd();
  },

  error: (requestId: string, error: AxiosError, duration?: number) => {
    if (!API_CONFIG.isDevelopment && !API_CONFIG.debug) return;

    const timestamp = new Date().toISOString();

    console.group(
      `%c❌ API Error [${requestId}]`,
      'color: #F44336; font-weight: bold; font-size: 12px;'
    );

    console.log('%c⏰ Timestamp:', 'color: #9E9E9E; font-weight: bold;', timestamp);

    if (duration !== undefined) {
      console.log('%c⚡ Duration:', 'color: #E91E63; font-weight: bold;', `${duration}ms`);
    }

    console.log('%c🌐 URL:', 'color: #2196F3; font-weight: bold;', error.config?.url);
    console.log('%c🔧 Method:', 'color: #2196F3; font-weight: bold;', error.config?.method?.toUpperCase());

    if (error.response) {
      // Server responded with error status
      console.log('%c📊 Status:', 'color: #F44336; font-weight: bold;', `${error.response.status} ${error.response.statusText}`);
      console.log('%c💬 Error Message:', 'color: #F44336; font-weight: bold;', error.message);

      if (error.response.data) {
        console.log('%c📥 Error Data:', 'color: #FF5722; font-weight: bold;', error.response.data);
      }

      if (error.response.headers) {
        console.log('%c📋 Response Headers:', 'color: #9C27B0; font-weight: bold;', error.response.headers);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.log('%c🚫 Error Type:', 'color: #F44336; font-weight: bold;', 'No Response Received');
      console.log('%c💬 Message:', 'color: #F44336; font-weight: bold;', error.message);

      if (API_CONFIG.debug) {
        console.log('%c📡 Request:', 'color: #FF5722; font-weight: bold;', error.request);
      }
    } else {
      // Error occurred during request setup
      console.log('%c🚫 Error Type:', 'color: #F44336; font-weight: bold;', 'Request Setup Error');
      console.log('%c💬 Message:', 'color: #F44336; font-weight: bold;', error.message);
    }

    if (error.code) {
      console.log('%c🔢 Error Code:', 'color: #F44336; font-weight: bold;', error.code);
    }

    if (API_CONFIG.isDevelopment && error.stack) {
      console.log('%c📚 Stack Trace:', 'color: #9E9E9E; font-weight: bold;');
      console.log(error.stack);
    }

    console.groupEnd();
  },
};

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
 * - Generates unique request ID for tracking
 * - Adds authentication token
 * - Records request start time
 * - Logs request details
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Generate unique request ID
    const requestId = generateRequestId();
    (config as any).metadata = { requestId, startTime: Date.now() };

    // Add authentication token if available
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request
    logger.request(requestId, config);

    return config;
  },
  (error: AxiosError) => {
    const requestId = (error.config as any)?.metadata?.requestId || 'UNKNOWN';
    logger.error(requestId, error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * - Calculates response duration
 * - Logs response details
 * - Handles common error scenarios
 * - Triggers auto-logout on 401
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const metadata = (response.config as any).metadata;
    const requestId = metadata?.requestId || 'UNKNOWN';
    const duration = metadata?.startTime ? Date.now() - metadata.startTime : 0;

    // Log response
    logger.response(requestId, response, duration);

    return response;
  },
  (error: AxiosError) => {
    // Calculate request duration if available
    const metadata = (error.config as any)?.metadata;
    const requestId = metadata?.requestId || 'UNKNOWN';
    const duration = metadata?.startTime ? Date.now() - metadata.startTime : undefined;

    // Log error
    logger.error(requestId, error, duration);

    // Handle common error scenarios
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - clear token and trigger logout event
          console.warn('🔒 Unauthorized request - clearing authentication token');
          localStorage.removeItem('accessToken');
          window.dispatchEvent(new CustomEvent('auth:logout'));
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('🚫 Permission denied - insufficient privileges');
          break;

        case 404:
          // Not found
          console.error('🔍 Resource not found');
          break;

        case 500:
          // Server error
          console.error('💥 Internal server error');
          break;

        case 502:
          // Bad gateway
          console.error('🌐 Bad gateway - server unreachable');
          break;

        case 503:
          // Service unavailable
          console.error('⚠️ Service temporarily unavailable');
          break;

        case 504:
          // Gateway timeout
          console.error('⏱️ Gateway timeout');
          break;

        default:
          if (status >= 400 && status < 500) {
            console.error('⚠️ Client error:', error.message);
          } else if (status >= 500) {
            console.error('💥 Server error:', error.message);
          }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('📡 No response from server - network error or timeout');
    } else {
      // Error setting up the request
      console.error('⚙️ Request configuration error:', error.message);
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
    console.log('🔑 Authentication token set');
  } else {
    localStorage.removeItem('accessToken');
    console.log('🔓 Authentication token removed');
  }
}

/**
 * Helper function to get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}
