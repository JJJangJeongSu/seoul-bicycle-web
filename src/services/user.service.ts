/**
 * User Service
 *
 * Handles user-related API calls
 */

import { mockRentals } from '../lib/mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getUserStatistics = async (userId: string): Promise<{
  totalRentals: number;
  totalDistance: number;
  totalDuration: number;
  averageDistance: number;
  averageDuration: number;
}> => {
  await delay();

  const userRentals = mockRentals.filter(r => r.userId === userId && r.status === 'returned');

  const totalDistance = userRentals.reduce((sum, r) => sum + (r.distance || 0), 0);
  const totalDuration = userRentals.reduce((sum, r) => sum + (r.duration || 0), 0);

  return {
    totalRentals: userRentals.length,
    totalDistance,
    totalDuration,
    averageDistance: userRentals.length > 0 ? totalDistance / userRentals.length : 0,
    averageDuration: userRentals.length > 0 ? totalDuration / userRentals.length : 0,
  };
};
