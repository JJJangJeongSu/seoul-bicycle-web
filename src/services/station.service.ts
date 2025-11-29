/**
 * Station Service
 *
 * Handles all station-related API calls
 * Automatically switches between mock and real API based on ApiModeContext
 */

import type { Station } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockStationService } from './mock.service';
import { stationsApi } from '../api';

// Singleton instances
const mockService = new MockStationService();

/**
 * Real API Station Service
 */
class RealStationService {
  async getAllStations(): Promise<Station[]> {
    const response = await stationsApi.getAllStations();
    return (response.data as any).data || response.data;
  }

  async getStationById(id: string): Promise<Station | null> {
    try {
      // getStationById is not in generated API yet
      const response = await apiClient.get(API_ENDPOINTS.stations.getById(id));
      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  }

  async getNearestStation(latitude: number, longitude: number): Promise<Station | null> {
    try {
      // API expects string for lat/lon
      const response = await stationsApi.getNearestStation(latitude.toString(), longitude.toString());
      return (response.data as any).data || response.data;
    } catch (error) {
      return null;
    }
  }

  async getStationsStatus(): Promise<{ total: number; active: number; inactive: number; available: number }> {
    const response = await stationsApi.getStationsStatus();
    return (response.data as any).data || response.data;
  }

  async updateStationBikeCount(id: string, count: number): Promise<Station> {
    // updateStationBikeCount is not in generated API yet
    const response = await apiClient.patch(API_ENDPOINTS.stations.update(id), {
      bikeCount: count,
    });
    return response.data.data || response.data;
  }
}

const realService = new RealStationService();

/**
 * Station Service Factory
 *
 * Returns appropriate service based on mock mode
 */
export class StationService {
  constructor(private useMockMode: boolean) {}

  getAllStations(): Promise<Station[]> {
    return this.useMockMode
      ? mockService.getAllStations()
      : realService.getAllStations();
  }

  getStationById(id: string): Promise<Station | null> {
    return this.useMockMode
      ? mockService.getStationById(id)
      : realService.getStationById(id);
  }

  getNearestStation(latitude: number, longitude: number): Promise<Station | null> {
    return this.useMockMode
      ? mockService.getNearestStation(latitude, longitude)
      : realService.getNearestStation(latitude, longitude);
  }

  getStationsStatus(): Promise<{ total: number; active: number; inactive: number; available: number }> {
    return this.useMockMode
      ? mockService.getStationsStatus()
      : realService.getStationsStatus();
  }

  updateStationBikeCount(id: string, count: number): Promise<Station> {
    return this.useMockMode
      ? mockService.updateStationBikeCount(id, count)
      : realService.updateStationBikeCount(id, count);
  }
}
