/**
 * Rental Service
 *
 * Handles rental-related API calls
 */

import type { Rental } from '../types';
import { mockRentals } from '../lib/mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const createRental = async (userId: string, stationId: string): Promise<Rental> => {
  await delay();

  const rental: Rental = {
    id: `R-${Date.now()}`,
    userId,
    bikeId: `SPB-${Math.floor(Math.random() * 90000) + 10000}`,
    startStationId: stationId,
    rentalTime: new Date(),
    status: 'rented',
  };

  mockRentals.push(rental);
  return rental;
};

export const returnRental = async (rentalId: string, stationId: string, distance: number, duration: number): Promise<Rental> => {
  await delay();

  const index = mockRentals.findIndex(r => r.id === rentalId);
  if (index === -1) throw new Error('Rental not found');

  mockRentals[index] = {
    ...mockRentals[index],
    endStationId: stationId,
    returnTime: new Date(),
    distance,
    duration,
    status: 'returned',
  };

  return mockRentals[index];
};

export const getUserRentals = async (userId: string): Promise<Rental[]> => {
  await delay();
  return mockRentals.filter(r => r.userId === userId);
};

export const getRentalById = async (id: string): Promise<Rental | null> => {
  await delay();
  return mockRentals.find(r => r.id === id) || null;
};
