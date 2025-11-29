/**
 * Rental Service
 *
 * Handles rental-related API calls
 */

import type { Rental } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockRentalService } from './mock.service';
import { rentalsApi } from '../api';

const mockService = new MockRentalService();

class RealRentalService {
  async createRental(userId: string, stationId: string): Promise<Rental> {
    // userId is inferred from token in the generated API
    const response = await rentalsApi.createRental({
      stationId,
    });
    return (response.data as any).data || response.data;
  }

  async returnRental(rentalId: string, stationId: string, distance: number, duration: number): Promise<Rental> {
    // distance and duration are calculated by backend
    const response = await rentalsApi.returnRental(rentalId, {
      endStationId: stationId,
    });
    return (response.data as any).data || response.data;
  }

  async getUserRentals(userId: string): Promise<Rental[]> {
    const response = await rentalsApi.getUserRentals(userId);
    return (response.data as any).data || response.data;
  }

  async getRentalById(id: string): Promise<Rental | null> {
    try {
      // getRentalById is not in generated API yet
      const response = await apiClient.get(API_ENDPOINTS.rentals.getById(id));
      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  }
}

const realService = new RealRentalService();

export class RentalService {
  constructor(private useMockMode: boolean) {}

  createRental(userId: string, stationId: string): Promise<Rental> {
    return this.useMockMode
      ? mockService.createRental(userId, stationId)
      : realService.createRental(userId, stationId);
  }

  returnRental(rentalId: string, stationId: string, distance: number, duration: number): Promise<Rental> {
    return this.useMockMode
      ? mockService.returnRental(rentalId, stationId, distance, duration)
      : realService.returnRental(rentalId, stationId, distance, duration);
  }

  getUserRentals(userId: string): Promise<Rental[]> {
    return this.useMockMode
      ? mockService.getUserRentals(userId)
      : realService.getUserRentals(userId);
  }

  getRentalById(id: string): Promise<Rental | null> {
    return this.useMockMode
      ? mockService.getRentalById(id)
      : realService.getRentalById(id);
  }
}
