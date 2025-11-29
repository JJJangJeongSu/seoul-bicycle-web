/**
 * User Service
 *
 * Handles user-related API calls
 */

import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockUserService } from './mock.service';
import { usersApi } from '../api';

const mockService = new MockUserService();

class RealUserService {
  async getUserStatistics(userId: string): Promise<{
    totalRentals: number;
    totalDistance: number;
    totalDuration: number;
    averageDistance: number;
    averageDuration: number;
  }> {
    const response = await usersApi.getUserStatistics(userId);
    return (response.data as any).data || response.data;
  }
}

const realService = new RealUserService();

export class UserService {
  constructor(private useMockMode: boolean) {}

  getUserStatistics(userId: string): Promise<{
    totalRentals: number;
    totalDistance: number;
    totalDuration: number;
    averageDistance: number;
    averageDuration: number;
  }> {
    return this.useMockMode
      ? mockService.getUserStatistics(userId)
      : realService.getUserStatistics(userId);
  }
}
