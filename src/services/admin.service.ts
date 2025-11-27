/**
 * Admin Service
 *
 * Handles admin-related API calls
 */

import type { User } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockAdminService } from './mock.service';

const mockService = new MockAdminService();

class RealAdminService {
  async getStatistics(): Promise<{
    totalUsers: number;
    totalStations: number;
    totalRentals: number;
    activeRentals: number;
  }> {
    const response = await apiClient.get(API_ENDPOINTS.admin.getStatistics);
    return response.data.data || response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get(API_ENDPOINTS.admin.getAllUsers);
    return response.data.data || response.data;
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.admin.getUserById(id));
      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  }

  async updateUserStatus(id: string, status: 'active' | 'suspended'): Promise<User> {
    const response = await apiClient.patch(API_ENDPOINTS.admin.updateUserStatus(id), {
      status,
    });
    return response.data.data || response.data;
  }
}

const realService = new RealAdminService();

export class AdminService {
  constructor(private useMockMode: boolean) {}

  getStatistics(): Promise<{
    totalUsers: number;
    totalStations: number;
    totalRentals: number;
    activeRentals: number;
  }> {
    return this.useMockMode
      ? mockService.getStatistics()
      : realService.getStatistics();
  }

  getAllUsers(): Promise<User[]> {
    return this.useMockMode
      ? mockService.getAllUsers()
      : realService.getAllUsers();
  }

  getUserById(id: string): Promise<User | null> {
    return this.useMockMode
      ? mockService.getUserById(id)
      : realService.getUserById(id);
  }

  updateUserStatus(id: string, status: 'active' | 'suspended'): Promise<User> {
    if (this.useMockMode) {
      throw new Error('User status update not supported in mock mode');
    }
    return realService.updateUserStatus(id, status);
  }
}
