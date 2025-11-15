/**
 * =====================================================
 * Rentals Routes
 * =====================================================
 *
 * 자전거 대여/반납 관련 라우트
 *
 * Base Path: /api/rentals
 *
 * Endpoints:
 * - POST   /                      - 자전거 대여
 * - PUT    /:rentalId/return      - 자전거 반납
 * - GET    /users/:userId/rentals - 사용자 대여 이력 조회
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const rentalsController = require('../controllers/rentals.controller');

// 미들웨어 import
const { authenticate, requireRole } = require('../middleware/auth');
const {
  validateCreateRental,
  validateReturnRental,
  validatePagination,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   POST /api/rentals
 * @desc    자전거 대여
 * @access  Private (일반 사용자만)
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Request Body:
 * {
 *   "stationId": "ST-001"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "rental": {
 *       "id": "R-123456789",
 *       "userId": "user_id",
 *       "bikeId": "SPB-00001",
 *       "startStationId": "ST-001",
 *       "rentalTime": "2024-11-15T10:30:00Z",
 *       "status": "rented"
 *     }
 *   }
 * }
 */
router.post(
  '/',
  authenticate,
  requireRole('user'),
  validateCreateRental,
  rentalsController.create
);

/**
 * @route   PUT /api/rentals/:rentalId/return
 * @desc    자전거 반납
 * @access  Private (일반 사용자만)
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Path Params:
 * - rentalId: string (예: R-123456789)
 *
 * Request Body:
 * {
 *   "endStationId": "ST-002",
 *   "distance": 3.45
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "rental": {
 *       "id": "R-123456789",
 *       "endStationId": "ST-002",
 *       "returnTime": "2024-11-15T11:00:00Z",
 *       "duration": 30,
 *       "distance": 3.45,
 *       "status": "returned"
 *     }
 *   }
 * }
 */
router.put(
  '/:rentalId/return',
  authenticate,
  requireRole('user'),
  validateReturnRental,
  rentalsController.returnBike
);

/**
 * @route   GET /api/rentals/users/:userId/rentals
 * @desc    사용자 대여 이력 조회
 * @access  Private (본인 또는 관리자)
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Path Params:
 * - userId: string
 *
 * Query Params:
 * - page: number (optional, default: 1)
 * - limit: number (optional, default: 20)
 * - status: string (optional) - rented | returned
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "rentals": [...],
 *     "statistics": {
 *       "totalRentals": 42,
 *       "totalDistance": 123.45,
 *       "totalDuration": 1234
 *     }
 *   },
 *   "pagination": {...}
 * }
 */
router.get(
  '/users/:userId/rentals',
  authenticate,
  validatePagination,
  rentalsController.getUserRentals
);

// =====================================================
// Export
// =====================================================

module.exports = router;
