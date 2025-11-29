/**
 * useServices Hook
 *
 * Provides access to all services with automatic mock/real mode switching
 * based on ApiModeContext
 */

import { useMemo } from 'react';
import * as authService from '../services/auth.service';
import * as stationService from '../services/station.service';
import * as rentalService from '../services/rental.service';
import * as boardService from '../services/board.service';
import * as repairService from '../services/repair.service';
import * as adminService from '../services/admin.service';
import * as userService from '../services/user.service';

/**
 * Services Hook
 *
 * Returns all service instances
 */
export function useServices() {
  // Memoize services to prevent recreation on every render
  const services = useMemo(() => ({
    stationService,
    authService,
    rentalService,
    boardService,
    repairService,
    adminService,
    userService,
  }), []);

  return services;
}
