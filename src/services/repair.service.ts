/**
 * Repair Service
 *
 * Handles repair-related API calls
 */

import type { Repair } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockRepairService } from './mock.service';
import { repairsApi, adminApi } from '../api';

const mockService = new MockRepairService();

class RealRepairService {
  async createRepair(repair: Omit<Repair, 'id' | 'createdAt' | 'status'>): Promise<Repair> {
    // API expects type, bikeId/stationId, category, description, photos. Reporter info is inferred.
    const response = await repairsApi.createRepair({
      type: repair.type as any,
      bikeId: repair.bikeId,
      stationId: repair.stationId,
      category: repair.category as any,
      description: repair.description,
      photos: repair.photos,
    });
    return (response.data as any).data || response.data;
  }

  async getMyRepairs(reporterId: string): Promise<Repair[]> {
    // reporterId is inferred from token for getMyRepairs
    const response = await repairsApi.getMyRepairs();
    return (response.data as any).data || response.data;
  }

  async getAllRepairs(): Promise<Repair[]> {
    // This seems to be an admin function or public list
    const response = await adminApi.getAllRepairsAdmin();
    return (response.data as any).data || response.data;
  }

  async getRepairById(id: string): Promise<Repair | null> {
    try {
      const response = await repairsApi.getRepairById(id);
      return (response.data as any).data || response.data;
    } catch (error) {
      return null;
    }
  }

  async updateRepairStatus(id: string, status: Repair['status'], adminNote?: string): Promise<Repair> {
    const response = await adminApi.updateRepairStatus(id, {
      status: status as any,
      adminNote,
    });
    return (response.data as any).data || response.data;
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
