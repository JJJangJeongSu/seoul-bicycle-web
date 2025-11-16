/**
 * Rental Service
 *
 * Handles rental-related API calls
 */

import type { Rental } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockRentalService } from './mock.service';

const mockService = new MockRentalService();

class RealRentalService {
  async createRental(userId: string, stationId: string): Promise<Rental> {
    const response = await apiClient.post(API_ENDPOINTS.rentals.create, {
      userId,
      stationId,
    });
    return response.data.data || response.data;
  }

  async returnRental(rentalId: string, stationId: string, distance: number, duration: number): Promise<Rental> {
    const response = await apiClient.post(API_ENDPOINTS.rentals.return(rentalId), {
      stationId,
      distance,
      duration,
    });
    return response.data.data || response.data;
  }

  async getUserRentals(userId: string): Promise<Rental[]> {
    const response = await apiClient.get(API_ENDPOINTS.rentals.getUserRentals, {
      params: { userId },
    });
    return response.data.data || response.data;
  }

  async getRentalById(id: string): Promise<Rental | null> {
    try {
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
