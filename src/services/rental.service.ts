/**
 * Rental Service
 *
 * Handles rental-related API calls
 */

import type { Rental } from '../types';
import { rentalsApi } from '../api';
import { CreateRental201ResponseAllOfData } from '../../CodeGenerator/models/create-rental201-response-all-of-data';
import { ReturnRental1 } from '../../CodeGenerator/models/return-rental1';

export const createRental = async (userId: string, stationId: string): Promise<Rental> => {
  const response = await rentalsApi.createRental({ stationId });
  // Cast response to access generated data structure
  const responseData = (response.data as unknown as { data: CreateRental201ResponseAllOfData }).data;
  
  const apiRental = responseData.rental;
  return {
    id: apiRental.id,
    userId: apiRental.user_id,
    bikeId: apiRental.bike_id,
    startStationId: apiRental.start_station_id,
    endStationId: apiRental.end_station_id ?? undefined,
    rentalTime: new Date(apiRental.rental_time ?? Date.now()),
    returnTime: apiRental.return_time ? new Date(apiRental.return_time) : undefined,
    distance: apiRental.distance ? parseFloat(apiRental.distance.toString()) : 0,
    duration: apiRental.duration ?? 0,
    status: apiRental.status as 'rented' | 'returned',
  };
};

export const returnRental = async (rentalId: string, stationId: string, distance: number, duration: number): Promise<Rental> => {
  const response = await rentalsApi.returnRental(rentalId, {
    endStationId: stationId,
  });
  // Cast response to access generated data structure
  const responseData = (response.data as unknown as { data: ReturnRental1 }).data;
  
  const apiRental = responseData.rental;
  return {
    id: apiRental.id,
    userId: apiRental.user_id,
    bikeId: apiRental.bike_id,
    startStationId: apiRental.start_station_id,
    endStationId: apiRental.end_station_id ?? undefined,
    rentalTime: new Date(apiRental.rental_time ?? Date.now()),
    returnTime: apiRental.return_time ? new Date(apiRental.return_time) : undefined,
    distance: apiRental.distance ? parseFloat(apiRental.distance.toString()) : 0,
    duration: apiRental.duration ?? 0,
    status: apiRental.status as 'rented' | 'returned',
  };
};

export const getUserRentals = async (userId: string): Promise<Rental[]> => {
  const response = await rentalsApi.getUserRentals(userId);
  const responseData = response.data as any; // Assuming standard list wrapper
  const rawRentals = responseData.data || []; // Adjust based on actual list response
  
  return Array.isArray(rawRentals) ? rawRentals.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    bikeId: item.bike_id,
    startStationId: item.start_station_id,
    endStationId: item.end_station_id ?? undefined,
    rentalTime: new Date(item.rental_time ?? Date.now()),
    returnTime: item.return_time ? new Date(item.return_time) : undefined,
    distance: item.distance ? parseFloat(item.distance) : 0,
    duration: item.duration ?? 0,
    status: item.status as 'rented' | 'returned',
  })) : [];
};

export const getRentalById = async (id: string): Promise<Rental | null> => {
  // Not directly supported by API, generally not used, or we could fetch user rentals if we had userId.
  // Returning null as it's likely not used in critical path with real API (context tracks object).
  console.warn('getRentalById is not supported by the API.');
  return null;
};
