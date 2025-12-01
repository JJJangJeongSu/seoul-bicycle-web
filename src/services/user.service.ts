/**
 * User Service
 *
 * Handles user-related API calls
 */

import { usersApi } from '../api';
import { mockRentals } from '../lib/mockData';
import { ChangePassword, Update } from '../../CodeGenerator';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const changePassword = async (userId: string, data: ChangePassword): Promise<void> => {
  await usersApi.changePassword(userId, data);
};

export const updateUser = async (userId: string, data: Update): Promise<void> => {
  await usersApi.updateUser(userId, data);
};

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


