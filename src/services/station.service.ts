/**
 * Station Service
 *
 * Handles all station-related API calls
 */

import type { Station } from '../types';
import { mockStations } from '../lib/mockData';

import { stationsApi } from '../api';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllStations = async (): Promise<Station[]> => {
  try {
    const response = await stationsApi.getAllStations();
    // @ts-ignore - The generated types are complex, accessing data directly
    const stations = response.data.data.stations;
    
    return stations.map((s: any) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
      bikeCount: s.bike_count,
      status: s.status,
    }));
  } catch (error) {
    console.error('Failed to fetch stations:', error);
    return [];
  }
};

export const getStationById = async (id: string): Promise<Station | null> => {
  await delay();
  return mockStations.find(s => s.id === id) || null;
};

export const getNearestStation = async (latitude: number, longitude: number): Promise<Station | null> => {
  try {
    const response = await stationsApi.getNearestStation(String(latitude), String(longitude));
    // @ts-ignore
    const data = response.data.data;
    
    if (!data || !data.station) return null;

    const s = data.station;
    return {
      id: s.id,
      name: s.name,
      address: s.address,
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
      bikeCount: s.bike_count,
      status: s.status,
    };
  } catch (error) {
    console.error('Failed to fetch nearest station:', error);
    return null;
  }
};

export const getStationsStatus = async (): Promise<{ total: number; active: number; inactive: number; available: number }> => {
  try {
    const response = await stationsApi.getStationsStatus();
    // @ts-ignore
    const stations = response.data.data.stations;

    const total = stations.length;
    const active = stations.filter((s: any) => s.status === 'active').length;
    const inactive = stations.filter((s: any) => s.status === 'inactive').length;
    const available = stations.filter((s: any) => s.status === 'active' && s.bike_count > 0).length;

    return { total, active, inactive, available };
  } catch (error) {
    console.error('Failed to fetch stations status:', error);
    return { total: 0, active: 0, inactive: 0, available: 0 };
  }
};

export const updateStationBikeCount = async (id: string, count: number): Promise<Station> => {
  await delay();

  const index = mockStations.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Station not found');

  // Note: This modifies the mock data in memory
  mockStations[index] = { ...mockStations[index], bikeCount: count };
  return mockStations[index];
};
