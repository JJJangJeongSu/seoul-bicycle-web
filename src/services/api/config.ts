/**
 * API Configuration
 *
 * Centralized configuration for API clients
 */

export const API_CONFIG = {
  // Base URL for the API
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',

  // Request timeout in milliseconds
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

  // Mock data delay (simulates network latency in mock mode)
  mockDelay: parseInt(import.meta.env.VITE_MOCK_DELAY || '800', 10),

  // Development mode
  isDevelopment: import.meta.env.DEV,

  // Debug logging
  debug: import.meta.env.VITE_DEBUG === 'true',
} as const;

/**
 * API Endpoints
 *
 * Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    checkEmail: '/api/auth/check-email',
    changePassword: '/api/auth/change-password',
  },
  stations: {
    getAll: '/api/stations',
    getById: (id: string) => `/api/stations/${id}`,
    getNearest: '/api/stations/nearest',
    getStatus: '/api/stations/status',
    create: '/api/admin/stations',
    update: (id: string) => `/api/admin/stations/${id}`,
    delete: (id: string) => `/api/admin/stations/${id}`,
  },
  rentals: {
    create: '/api/rentals',
    return: (id: string) => `/api/rentals/${id}/return`,
    getUserRentals: '/api/rentals/my',
    getById: (id: string) => `/api/rentals/${id}`,
  },
  board: {
    getAllPosts: '/api/board/posts',
    getPostById: (id: string) => `/api/board/posts/${id}`,
    createPost: '/api/board/posts',
    updatePost: (id: string) => `/api/board/posts/${id}`,
    deletePost: (id: string) => `/api/board/posts/${id}`,
  },
  repairs: {
    create: '/api/repairs',
    getMy: '/api/repairs/my',
    getAll: '/api/admin/repairs',
    getById: (id: string) => `/api/repairs/${id}`,
    updateStatus: (id: string) => `/api/admin/repairs/${id}/status`,
  },
  admin: {
    getStatistics: '/api/admin/statistics',
    getAllUsers: '/api/admin/users',
    getUserById: (id: string) => `/api/admin/users/${id}`,
    updateUserStatus: (id: string) => `/api/admin/users/${id}/status`,
  },
  users: {
    getStatistics: '/api/users/statistics',
  },
  routes: {
    calculate: '/api/routes/calculate',
    geocode: '/api/routes/geocode',
  },
  ai: {
    recommendCourse: '/api/ai/recommend-course',
  },
} as const;
