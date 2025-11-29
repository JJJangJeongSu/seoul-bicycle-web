/**
 * Routes Service
 *
 * Handles route calculation and geocoding API calls
 */

import { routesApi } from '../api';

class RealRoutesService {
  async calculateRoute(startLat: number, startLon: number, endLat: number, endLon: number) {
    const response = await routesApi.calculateRoute({
      startLat,
      startLon,
      endLat,
      endLon,
    });
    return (response.data as any).data || response.data;
  }

  async geocodeAddress(address: string) {
    const response = await routesApi.geocodeAddress(address);
    return (response.data as any).data || response.data;
  }
}

const realService = new RealRoutesService();

export class RoutesService {
  // Currently no mock mode support for routes as it requires complex logic
  // But we can add it if needed. For now, we use real service.
  
  calculateRoute(startLat: number, startLon: number, endLat: number, endLon: number) {
    return realService.calculateRoute(startLat, startLon, endLat, endLon);
  }

  geocodeAddress(address: string) {
    return realService.geocodeAddress(address);
  }
}

export const routesService = new RoutesService();
