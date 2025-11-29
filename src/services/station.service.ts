/**
 * Station Service
 *
 * Handles all station-related API calls
 */

import type { Station } from '../types';
import { mockStations } from '../lib/mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllStations = async (): Promise<Station[]> => {
  await delay();
  return [...mockStations];
};

export const getStationById = async (id: string): Promise<Station | null> => {
  await delay();
  return mockStations.find(s => s.id === id) || null;
};

export const getNearestStation = async (latitude: number, longitude: number): Promise<Station | null> => {
  await delay();

  // Calculate distances and find nearest
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const activeStations = mockStations.filter(s => s.status === 'active' && s.bikeCount > 0);
  if (activeStations.length === 0) return null;

  let nearest = activeStations[0];
  let minDistance = calculateDistance(latitude, longitude, nearest.latitude, nearest.longitude);

  for (const station of activeStations) {
    const distance = calculateDistance(latitude, longitude, station.latitude, station.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return nearest;
};

export const getStationsStatus = async (): Promise<{ total: number; active: number; inactive: number; available: number }> => {
  await delay();

  const total = mockStations.length;
  const active = mockStations.filter(s => s.status === 'active').length;
  const inactive = mockStations.filter(s => s.status === 'inactive').length;
  const available = mockStations.filter(s => s.status === 'active' && s.bikeCount > 0).length;

  return { total, active, inactive, available };
};

export const updateStationBikeCount = async (id: string, count: number): Promise<Station> => {
  await delay();

  const index = mockStations.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Station not found');

  // Note: This modifies the mock data in memory
  mockStations[index] = { ...mockStations[index], bikeCount: count };
  return mockStations[index];
};
