/**
/**
 * Repair Service
 *
 * Handles repair-related API calls
 */

import type { Repair } from '../types';
import { mockRepairs } from '../lib/mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const createRepair = async (repair: Omit<Repair, 'id' | 'createdAt' | 'status'>): Promise<Repair> => {
  await delay();

  const newRepair: Repair = {
    ...repair,
    id: `REP-${Date.now()}`,
    status: 'pending',
    createdAt: new Date(),
  };

  mockRepairs.unshift(newRepair);
  return newRepair;
};

export const getMyRepairs = async (reporterId: string): Promise<Repair[]> => {
  await delay();
  return mockRepairs.filter(r => r.reporterId === reporterId);
};

export const getAllRepairs = async (): Promise<Repair[]> => {
  await delay();
  return [...mockRepairs];
};

export const getRepairById = async (id: string): Promise<Repair | null> => {
  await delay();
  return mockRepairs.find(r => r.id === id) || null;
};

export const updateRepairStatus = async (id: string, status: Repair['status'], adminNote?: string): Promise<Repair> => {
  await delay();

  const index = mockRepairs.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Repair not found');

  mockRepairs[index] = {
    ...mockRepairs[index],
    status,
    adminNote,
    completedAt: status === 'completed' ? new Date() : undefined,
  };

  return mockRepairs[index];
};
