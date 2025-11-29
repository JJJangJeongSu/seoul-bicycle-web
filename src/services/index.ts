/**
 * Services Index
 *
 * Central export point for all services
 */

export * as stationService from './station.service';
export * as authService from './auth.service';
export * as rentalService from './rental.service';
export * as boardService from './board.service';
export * as repairService from './repair.service';
export * as adminService from './admin.service';
export * as userService from './user.service';
export * as aiService from './ai.service';

// API utilities
export { axiosInstance as apiClient, setAuthToken, getAuthToken } from '../api';
export { apiConfig } from '../api';
