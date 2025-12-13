/**
 * Admin Service
 *
 * Provides API interaction methods for administrative tasks including
 * user management, station management, repair tracking, and statistics.
 */

import axios from 'axios';
import { adminApi } from '../api';
import { axiosInstance } from '../api/config';
import type { 
  User, 
  Station,
  Repair, 
  Pagination,
  CreateStation, 
  UpdateStation, 
  UpdateUserStatus, 
  UpdateRepairStatus,
  AdminStatistics,
  GetStationAdmin200ResponseAllOfData,
  Bike,
  Rental
} from '../../CodeGenerator/models';

// Re-export specific types if needed by components, or components import directly
// Re-export specific types if needed by components, or components import directly
export type { User, Station, Repair, Pagination, Rental, Bike };

// ==========================================
// Dashboard Statistics
// ==========================================

/**
 * Fetches overall system statistics for the admin dashboard.
 * @returns Promise<AdminStatistics>
 */
export const getStatistics = async (): Promise<AdminStatistics> => {
  const response = await adminApi.getAdminStatistics();
  const data = response.data as any; 
  const stats = data.data || data;
  return stats;
};

// ==========================================
// User Management
// ==========================================

/**
 * Retrieves a paginated list of all users.
 * @param page - Current page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Optional search query
 * @returns Promise<{ users: User[], pagination: Pagination }>
 */
export const getAllUsers = async (
  page: number = 1, 
  limit: number = 10, 
  search?: string
): Promise<{ users: User[], pagination: Pagination }> => {
  const response = await adminApi.getAllUsersAdmin(page, limit, search);
  const data = response.data as any;
  const responseData = data.data || data;
  const users = responseData.users || [];
  const pagination = responseData.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: users.length,
    itemsPerPage: limit,
    hasNext: false,
    hasPrev: false
  };

  return { users, pagination };
};

/**
 * Retrieves a single user by their ID.
 * @param id - User ID
 * @returns Promise<User | null>
 */
export const getUserById = async (id: string): Promise<User | null> => {
  const { users } = await getAllUsers(1, 1000, id);
  return users.find((u: User) => u.id === id) || null;
};

/**
 * Updates the status of a user (e.g., active or blocked).
 * @param id - User ID
 * @param status - New status
 */
export const updateUserStatus = async (id: string, status: 'active' | 'blocked'): Promise<void> => {
  const updateData: UpdateUserStatus = { status };
  await adminApi.updateUserStatus(id, updateData);
};

/**
 * Deletes a user from the system.
 * @param id - User ID
 */
export const deleteUser = async (id: string): Promise<void> => {
  await adminApi.deleteUserAdmin(id);
};

// ==========================================
// Station Management
// ==========================================

/**
 * Retrieves all stations.
 * @returns Promise<Station[]>
 */
export const getAllStations = async (
  page: number = 1, 
  limit: number = 10, 
  search?: string
): Promise<{ stations: Station[], pagination: Pagination }> => {
  const response = await adminApi.getAllStationsAdmin(page, limit, search);
  const data = response.data as any;
  const responseData = data.data || data;
  const stations = responseData.stations || [];
  const pagination = responseData.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: stations.length,
    itemsPerPage: limit,
    hasNext: false,
    hasPrev: false
  };

  return { stations, pagination };
};

/**
 * Retrieves a single station by its ID.
 * @param id - Station ID
 * @returns Promise<Station | null>
 */

/*
{
    "success": true,
    "message": "string",
    "data": {
        "station_info": {
            "id": "ST-001",
            "name": "강남역 1번출구",
            "address": "서울특별시 강남구 강남대로 396",
            "latitude": "string",
            "longitude": "string",
            "bike_count": 12,
            "capacity": 20,
            "status": "active",
            "created_at": "2019-08-24T14:15:22.123Z",
            "updated_at": "2019-08-24T14:15:22.123Z"
        },
        "bikes": [
            {
                "id": "string",
                "status": "available",
                "current_station_id": "string",
                "created_at": "2019-08-24T14:15:22.123Z",
                "updated_at": "2019-08-24T14:15:22.123Z",
                "use_count": 0
            }
        ]
    }
}
*/
export const getStationById = async (id: string): Promise<{station_info: Station, bikes: Bike[]} | null> => {
  const response = await adminApi.getStationAdmin(id);
  const data = response.data as any;
  const responseData = data.data || data;
  const station_info = responseData.station_info as Station;
  const bikes = responseData.bikes as Bike[];
  return {station_info, bikes};
};

/**
 * Creates a new station.
 * @param stationData - Data for the new station
 */
export const createStation = async (stationData: CreateStation): Promise<void> => {
  await adminApi.createStation(stationData);
};

/**
 * Updates an existing station's details.
 * @param id - Station ID
 * @param stationData - Updated data
 */
export const updateStation = async (id: string, stationData: UpdateStation): Promise<void> => {
  await adminApi.updateStation(id, stationData);
};

/**
 * Deletes a station.
 * @param id - Station ID
 */
export const deleteStation = async (id: string): Promise<void> => {
  await adminApi.deleteStation(id);
};

// ==========================================
// Repair Management
// ==========================================

/**
 * Retrieves a paginated list of repair requests, optionally filtered by status.
 * @param status - Optional status filter
 * @param page - Current page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise<{ repairs: Repair[], pagination: Pagination }>
 */
export const getAllRepairs = async (
  status?: any, // Type compatibility with generated enum if needed, or 'pending' | ...
  page: number = 1, 
  limit: number = 10
): Promise<{ repairs: Repair[], pagination: Pagination }> => {
  const response = await adminApi.getAllRepairsAdmin(status, page);
  const data = response.data as any;
  const responseData = data.data || data;
  const repairs = responseData.repairs || [];
  const pagination = responseData.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: repairs.length,
    itemsPerPage: limit,
    hasNext: false,
    hasPrev: false
  };
  
  return { repairs, pagination };
};

/**
 * Updates the status and admin note of a repair request.
 * @param id - Repair ID
 * @param status - New status
 * @param adminNote - Optional admin note
 */
export const updateRepairStatus = async (
  id: string, 
  status: 'pending' | 'in-progress' | 'completed', 
  adminNote?: string
): Promise<void> => {
  const updateData: UpdateRepairStatus = { 
    status: status as any, // Cast if enum mismatch
    admin_note: adminNote 
  };
  await adminApi.updateRepairStatus(id, updateData);
};

/**
 * Fully updates a repair request with all editable details.
 * @param id - Repair ID
 * @param data - Full update data object
 */
export const updateRepair = async (id: string, data: any): Promise<void> => {
  // Using direct axios instance to handle simplified payload structure
  const payload = {
    category: data.category,
    bike_id: data.bikeId || data.bike_id,
    station_id: data.stationId || data.station_id,
    description: data.description,
    status: data.status,
    admin_note: data.adminNote || data.admin_note
  };
  await axiosInstance.put(`/admin/repairs/${id}`, payload);
};


/*
Bike Management
*/

/**
 * Retrieves a paginated list of all bikes.
 * @param page - Current page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param searchId - Optional bike ID search query
 * @returns Promise<{ bikes: Bike[], pagination: Pagination }>
 */
export const getAllBikes = async (
  page: number = 1,
  limit: number = 10,
  searchId?: string
): Promise<{ bikes: Bike[], pagination: Pagination }> => {
  const response = await adminApi.getAllBikesAdmin(page, limit, searchId);
  const data = response.data as any;
  const responseData = data.data || data;
  const bikes = responseData.bikes || [];
  const pagination = responseData.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: bikes.length,
    itemsPerPage: limit,
    hasNext: false,
    hasPrev: false
  };

  return { bikes, pagination };
};

/**
 * Creates a new bike.
 * @param stationId - The ID of the station where the bike is located
 */
export const createBike = async (stationId: string): Promise<void> => {
  await adminApi.createBike(stationId);
};

/**
 * Retrieves a single bike by its ID.
 * @param id - Bike ID
 * @returns Promise<{ bike: Bike, pagination: Pagination } | null>
 */
export const getBikeById = async (id: string): Promise<{ bike: Bike, pagination: Pagination } | null> => {
  try {
    const response = await adminApi.getBikeAdmin(id);
    const data = response.data as any;
    const responseData = data.data || data;
    const bike = responseData.bike as Bike;
    const pagination = responseData.pagination as Pagination;
    return { bike, pagination };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Deletes a bike.
 * @param id - Bike ID
 */
export const deleteBike = async (id: string): Promise<void> => {
  await adminApi.deleteBike(id);
};

/**
 * Updates a bike's status.
 * @param id - Bike ID
 * @param status - New status
 */
export const updateBikeStatus = async (
  id: string, 
  status: 'available' | 'rented' | 'maintenance' | 'broken'
): Promise<void> => {
  await adminApi.updateBikeStatus(id, status as any);
};

/**
 * Retrieves rental records for a specific bike.
 * @param bikeId - Bike ID
 * @param page - Current page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param sortBy - Sort order ('recent' or 'old')
 * @returns Promise<{ records: Rental[], pagination: Pagination }>
 */
export const getBikeRentalRecords = async (
  bikeId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'recent' | 'old' = 'recent'
): Promise<{ records: Rental[], pagination: Pagination }> => {
  const response = await adminApi.getBikeRentalRecords(bikeId, page, limit, sortBy as any);
  const data = response.data as any;
  const responseData = data.data || data;
  const records = responseData.records || [];
  const pagination = responseData.pagination || {
    currentPage: page,
    totalPages: 1,
    totalItems: records.length,
    itemsPerPage: limit,
    hasNext: false,
    hasPrev: false
  };

  return { records, pagination };
};


