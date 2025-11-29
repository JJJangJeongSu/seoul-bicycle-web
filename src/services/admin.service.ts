/**
 * Admin Service
 *
 * Handles admin-related API calls
 */

import type { User } from '../types';
import { mockStations, mockRentals } from '../lib/mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getStatistics = async (): Promise<{
  totalUsers: number;
  totalStations: number;
  totalRentals: number;
  activeRentals: number;
}> => {
  await delay();

  return {
    totalUsers: 1523,
    totalStations: mockStations.length,
    totalRentals: mockRentals.length,
    activeRentals: mockRentals.filter(r => r.status === 'rented').length,
  };
};

export const getAllUsers = async (): Promise<User[]> => {
  await delay();

  // Mock users
  return [
    {
      id: '1',
      email: 'user@test.com',
      name: '홍길동',
      role: 'user',
      phone: '010-1234-5678',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'admin@test.com',
      name: '관리자',
      role: 'admin',
      phone: '010-9876-5432',
      createdAt: new Date().toISOString(),
    },
  ];
};

export const getUserById = async (id: string): Promise<User | null> => {
  await delay();

  const users = await getAllUsers();
  return users.find(u => u.id === id) || null;
};

export const updateUserStatus = async (id: string, status: 'active' | 'suspended'): Promise<User> => {
    await delay();
    // Mock implementation - just return a dummy user with updated status
    const users = await getAllUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
};
