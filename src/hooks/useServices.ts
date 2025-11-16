/**
 * useServices Hook
 *
 * Provides access to all services with automatic mock/real mode switching
 * based on ApiModeContext
 */

import { useMemo } from 'react';
import { useApiMode } from '../contexts/ApiModeContext';
import {
  StationService,
  AuthService,
  RentalService,
  BoardService,
  RepairService,
  AdminService,
  UserService,
} from '../services';

/**
 * Services Hook
 *
 * Returns all service instances configured with current API mode
 *
 * @example
 * ```tsx
 * const { stationService, authService } = useServices();
 *
 * // Fetch stations (automatically uses mock or real API)
 * const stations = await stationService.getAllStations();
 * ```
 */
export function useServices() {
  const { useMockMode } = useApiMode();

  // Memoize services to prevent recreation on every render
  const services = useMemo(() => ({
    stationService: new StationService(useMockMode),
    authService: new AuthService(useMockMode),
    rentalService: new RentalService(useMockMode),
    boardService: new BoardService(useMockMode),
    repairService: new RepairService(useMockMode),
    adminService: new AdminService(useMockMode),
    userService: new UserService(useMockMode),
  }), [useMockMode]);

  return services;
}
