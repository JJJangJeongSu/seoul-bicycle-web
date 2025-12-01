/**
 * Admin Service
 *
 * Handles admin-related API calls
 */

import { adminApi } from '../api';
import type { User, AdminStatistics, Station, Repair, Pagination } from '../types';
import type { CreateStation, UpdateStation, UpdateUserStatus, UpdateRepairStatus } from '../../CodeGenerator/models';

export const getStatistics = async (): Promise<AdminStatistics> => {
  const response = await adminApi.getAdminStatistics();
  const data = response.data as any; // Handle wrapper
  const stats = data.data || data;
  
  return {
    totalUsers: stats.total_users,
    totalStations: stats.total_stations,
    totalBikes: stats.total_bikes,
    activeRentals: stats.active_rentals,
    todayRentalsToday: stats.today_rentals_today,
    totalRepairsPending: stats.total_repairs_pending,
  };
};

export const getAllUsers = async (page: number = 1, limit: number = 10, search?: string): Promise<{ users: User[], pagination: Pagination }> => {
  const response = await adminApi.getAllUsersAdmin(page, limit, search);
  const data = response.data as any;
  const responseData = data.data || data;
  const usersData = responseData.users || [];
  const paginationData = responseData.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: usersData.length,
    itemsPerPage: limit,
    hasNext: false,
    hasPrev: false
  };
  
  const users = usersData.map((user: any) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    status: user.status,
  }));

  return { users, pagination: paginationData };
};

export const getUserById = async (id: string): Promise<User | null> => {
  // Currently no direct API for get user by ID for admin, 
  // but we can filter from list or implement if needed.
  // For now, we'll fetch list and find (inefficient but works for small scale)
  // Or we can use the general user API if admin has access.
  // Let's assume we use the list for now as per previous mock implementation pattern
  const { users } = await getAllUsers(1, 1000, id); // Search by ID if supported or just fetch all
  return users.find(u => u.id === id) || null;
};

export const updateUserStatus = async (id: string, status: 'active' | 'blocked'): Promise<void> => {
  const updateData: UpdateUserStatus = { status };
  await adminApi.updateUserStatus(id, updateData);
};

export const deleteUser = async (id: string): Promise<void> => {
  await adminApi.deleteUserAdmin(id);
};

// Station Management
export const createStation = async (stationData: CreateStation): Promise<void> => {
  await adminApi.createStation(stationData);
};

export const updateStation = async (id: string, stationData: UpdateStation): Promise<void> => {
  await adminApi.updateStation(id, stationData);
};

export const deleteStation = async (id: string): Promise<void> => {
  await adminApi.deleteStation(id);
};

// Repair Management
export const getAllRepairs = async (status?: 'pending' | 'in-progress' | 'completed', page: number = 1): Promise<Repair[]> => {
  const response = await adminApi.getAllRepairsAdmin(status, page);
  const data = response.data as any;
  const repairsData = data.data?.repairs || data.repairs || [];

  return repairsData.map((repair: any) => ({
    id: repair.id,
    type: repair.type,
    bikeId: repair.bike_id,
    stationId: repair.station_id,
    category: repair.category,
    description: repair.description,
    reporter: repair.reporter_name,
    reporterId: repair.reporter_id,
    status: repair.status,
    createdAt: new Date(repair.created_at),
    completedAt: repair.completed_at ? new Date(repair.completed_at) : undefined,
    adminNote: repair.admin_note,
  }));
};

export const updateRepairStatus = async (id: string, status: 'pending' | 'in-progress' | 'completed', adminNote?: string): Promise<void> => {
  const updateData: UpdateRepairStatus = { status, admin_note: adminNote };
  await adminApi.updateRepairStatus(id, updateData);
};
