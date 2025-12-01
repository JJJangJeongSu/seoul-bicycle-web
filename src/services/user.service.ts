/**
 * User Service
 *
 * Handles user-related API calls
 */

import { usersApi } from '../api';
import { ChangePassword, Update } from '../../CodeGenerator';
import { UserStatistics } from '../../CodeGenerator/models/user-statistics';
import { Rental } from '../types';

export const changePassword = async (userId: string, data: ChangePassword): Promise<void> => {
  await usersApi.changePassword(userId, data);
};

export const updateUser = async (userId: string, data: Update): Promise<void> => {
  await usersApi.updateUser(userId, data);
};

export const getUserStatistics = async (userId: string): Promise<UserStatistics> => {
  const response = await usersApi.getUserStatistics(userId);
  // Handle response wrapper if present
  const responseData = response.data as any;
  return responseData.data || responseData;
};

export const getUserRentals = async (userId: string): Promise<Rental[]> => {
  const response = await usersApi.getUserRentals(userId);
  // Handle response wrapper if present
  const responseData = response.data as any;
  const rawData = responseData.data || responseData;

  // Map API response (snake_case) to frontend model (camelCase)
  return Array.isArray(rawData) ? rawData.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    bikeId: item.bike_id,
    startStationId: item.start_station_id,
    endStationId: item.end_station_id,
    rentalTime: new Date(item.rental_time),
    returnTime: item.return_time ? new Date(item.return_time) : undefined,
    distance: item.distance ? parseFloat(item.distance) : 0,
    duration: item.duration,
    status: item.status,
  })) : [];
};