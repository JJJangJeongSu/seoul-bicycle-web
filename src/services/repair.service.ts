/**
 * Repair Service
 *
 * Handles repair-related API calls
 */

import type { Repair } from '../types';
import { repairsApi } from '../api';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));


// 고장 신고 등록
export const createRepair = async (repair: Omit<Repair, 'id' | 'createdAt' | 'status'>): Promise<Repair> => {
  await repairsApi.createRepair(repair);

  const newRepair: Repair = {
    ...repair,
    id: `REP-${Date.now()}`,
    status: 'pending',
    createdAt: new Date(),
  };

  return newRepair;
};


// 내 신고 내역 조회
// GET /repairs/my
export const getMyRepairs = async (): Promise<Repair[]> => {
  const response = await repairsApi.getMyRepairs();
  // Handle response wrapper if present
  const responseData = response.data as any;
  const items = responseData.data || responseData;

  return Array.isArray(items) ? items.map((item: any) => ({
    id: item.id,
    type: item.type,
    bikeId: item.bike_id,
    stationId: item.station_id,
    category: item.category,
    description: item.description,
    reporter: item.reporter_name,
    reporterId: item.reporter_id,
    status: item.status,
    createdAt: new Date(item.created_at),
    completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
    adminNote: item.admin_note,
  })) : [];
};


// 신고 상세 조회
export const getRepairById = async (id: string): Promise<Repair | null> => {
  const response = await repairsApi.getRepairById(id);
  // Handle response wrapper if present
  const responseData = response.data as any;
  const item = responseData.data || responseData;

  if (!item) return null;

  return {
    id: item.id,
    type: item.type,
    bikeId: item.bike_id,
    stationId: item.station_id,
    category: item.category,
    description: item.description,
    reporter: item.reporter_name,
    reporterId: item.reporter_id,
    status: item.status,
    createdAt: new Date(item.created_at),
    completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
    adminNote: item.admin_note,
  };
};