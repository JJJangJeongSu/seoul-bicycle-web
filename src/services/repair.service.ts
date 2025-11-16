/**
 * Repair Service
 *
 * Handles repair-related API calls
 */

import type { Repair } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockRepairService } from './mock.service';

const mockService = new MockRepairService();

class RealRepairService {
  async createRepair(repair: Omit<Repair, 'id' | 'createdAt' | 'status'>): Promise<Repair> {
    const response = await apiClient.post(API_ENDPOINTS.repairs.create, repair);
    return response.data.data || response.data;
  }

  async getMyRepairs(reporterId: string): Promise<Repair[]> {
    const response = await apiClient.get(API_ENDPOINTS.repairs.getMy, {
      params: { reporterId },
    });
    return response.data.data || response.data;
  }

  async getAllRepairs(): Promise<Repair[]> {
    const response = await apiClient.get(API_ENDPOINTS.repairs.getAll);
    return response.data.data || response.data;
  }

  async getRepairById(id: string): Promise<Repair | null> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.repairs.getById(id));
      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  }

  async updateRepairStatus(id: string, status: Repair['status'], adminNote?: string): Promise<Repair> {
    const response = await apiClient.patch(API_ENDPOINTS.repairs.updateStatus(id), {
      status,
      adminNote,
    });
    return response.data.data || response.data;
  }
}

const realService = new RealRepairService();

export class RepairService {
  constructor(private useMockMode: boolean) {}

  createRepair(repair: Omit<Repair, 'id' | 'createdAt' | 'status'>): Promise<Repair> {
    return this.useMockMode
      ? mockService.createRepair(repair)
      : realService.createRepair(repair);
  }

  getMyRepairs(reporterId: string): Promise<Repair[]> {
    return this.useMockMode
      ? mockService.getMyRepairs(reporterId)
      : realService.getMyRepairs(reporterId);
  }

  getAllRepairs(): Promise<Repair[]> {
    return this.useMockMode
      ? mockService.getAllRepairs()
      : realService.getAllRepairs();
  }

  getRepairById(id: string): Promise<Repair | null> {
    return this.useMockMode
      ? mockService.getRepairById(id)
      : realService.getRepairById(id);
  }

  updateRepairStatus(id: string, status: Repair['status'], adminNote?: string): Promise<Repair> {
    return this.useMockMode
      ? mockService.updateRepairStatus(id, status, adminNote)
      : realService.updateRepairStatus(id, status, adminNote);
  }
}
