/**
 * =====================================================
 * Admin Routes
 * =====================================================
 *
 * 관리자 전용 기능 관련 라우트
 *
 * Base Path: /api/admin
 *
 * Endpoints:
 * - GET    /statistics       - 통계 대시보드
 * - GET    /users            - 사용자 목록 조회
 * - PUT    /users/:id/status - 사용자 상태 변경
 * - GET    /stations         - 대여소 관리
 * - GET    /bikes            - 자전거 관리
 * - GET    /repairs          - 고장 신고 관리
 * - PUT    /repairs/:id      - 고장 신고 처리
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const adminController = require('../controllers/admin.controller');

// 미들웨어 import
const { authenticate, requireRole } = require('../middleware/auth');
const {
  validatePagination,
  validateUpdateUserStatus,
  validateId,
} = require('../middleware/validateRequest');

// =====================================================
// 모든 관리자 라우트는 인증 및 관리자 권한 필요
// =====================================================

router.use(authenticate);
router.use(requireRole('admin'));

// =====================================================
// Routes
// =====================================================

/**
 * @route   GET /api/admin/statistics
 * @desc    통계 대시보드 데이터 조회
 * @access  Private (Admin)
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "overview": {
 *       "totalUsers": 1234,
 *       "activeUsers": 1000,
 *       "totalStations": 50,
 *       "totalBikes": 500,
 *       "activeRentals": 42
 *     },
 *     "rentalStats": {
 *       "today": 120,
 *       "thisWeek": 850,
 *       "thisMonth": 3200
 *     },
 *     "repairStats": {
 *       "pending": 5,
 *       "inProgress": 3,
 *       "completed": 42
 *     }
 *   }
 * }
 */
router.get('/statistics', adminController.getStatistics);

/**
 * @route   GET /api/admin/users
 * @desc    사용자 목록 조회 (관리자용)
 * @access  Private (Admin)
 *
 * Query Params:
 * - page: number (optional)
 * - limit: number (optional)
 * - role: string (optional) - user | admin
 * - status: string (optional) - active | blocked
 * - search: string (optional) - 이름 또는 이메일 검색
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "users": [
 *       {
 *         "id": "user_id",
 *         "email": "user@example.com",
 *         "name": "홍길동",
 *         "phone": "010-1234-5678",
 *         "role": "user",
 *         "status": "active",
 *         "createdAt": "2024-01-01T00:00:00Z",
 *         "rentalCount": 42,
 *         "lastRentalDate": "2024-11-15T10:30:00Z"
 *       }
 *     ]
 *   },
 *   "pagination": {...}
 * }
 */
router.get('/users', validatePagination, adminController.getUsers);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    사용자 상태 변경 (활성화/차단)
 * @access  Private (Admin)
 *
 * Path Params:
 * - id: string (사용자 ID)
 *
 * Request Body:
 * {
 *   "status": "blocked" | "active"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "user": {
 *       "id": "user_id",
 *       "status": "blocked"
 *     }
 *   }
 * }
 */
router.put(
  '/users/:id/status',
  validateUpdateUserStatus,
  adminController.updateUserStatus
);

/**
 * @route   GET /api/admin/stations
 * @desc    대여소 관리 (상세 정보 포함)
 * @access  Private (Admin)
 *
 * Query Params:
 * - page: number (optional)
 * - limit: number (optional)
 * - status: string (optional) - active | inactive
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "stations": [
 *       {
 *         "id": "ST-001",
 *         "name": "강남역 1번출구",
 *         "address": "...",
 *         "bikeCount": 12,
 *         "capacity": 20,
 *         "status": "active",
 *         "totalRentals": 1234,
 *         "lastRentalTime": "2024-11-15T10:30:00Z"
 *       }
 *     ]
 *   },
 *   "pagination": {...}
 * }
 */
router.get('/stations', validatePagination, adminController.getStations);

/**
 * @route   GET /api/admin/bikes
 * @desc    자전거 관리 (상태별 조회)
 * @access  Private (Admin)
 *
 * Query Params:
 * - page: number (optional)
 * - limit: number (optional)
 * - status: string (optional) - available | rented | maintenance | broken
 * - stationId: string (optional) - 특정 대여소의 자전거만 조회
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "bikes": [
 *       {
 *         "id": "SPB-00001",
 *         "currentStationId": "ST-001",
 *         "status": "available",
 *         "model": "Seoul Bike v2",
 *         "totalRentals": 234,
 *         "lastRentalTime": "2024-11-15T09:00:00Z"
 *       }
 *     ]
 *   },
 *   "pagination": {...}
 * }
 */
router.get('/bikes', validatePagination, adminController.getBikes);

/**
 * @route   GET /api/admin/repairs
 * @desc    고장 신고 관리 (전체 신고 조회)
 * @access  Private (Admin)
 *
 * Query Params:
 * - page: number (optional)
 * - limit: number (optional)
 * - status: string (optional) - pending | in-progress | completed
 * - type: string (optional) - bike | station
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "repairs": [
 *       {
 *         "id": "REP-123456789",
 *         "reporterId": "user_id",
 *         "reporterName": "홍길동",
 *         "type": "bike",
 *         "bikeId": "SPB-00001",
 *         "category": "brake",
 *         "description": "브레이크가 작동하지 않습니다",
 *         "status": "pending",
 *         "createdAt": "2024-11-15T10:30:00Z"
 *       }
 *     ]
 *   },
 *   "pagination": {...}
 * }
 */
router.get('/repairs', validatePagination, adminController.getRepairs);

/**
 * @route   PUT /api/admin/repairs/:id
 * @desc    고장 신고 상태 변경 및 메모 추가
 * @access  Private (Admin)
 *
 * Path Params:
 * - id: string (신고 ID)
 *
 * Request Body:
 * {
 *   "status": "in-progress" | "completed",
 *   "adminNote": "수리 진행 중입니다"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "repair": {
 *       "id": "REP-123456789",
 *       "status": "in-progress",
 *       "adminNote": "수리 진행 중입니다"
 *     }
 *   }
 * }
 */
router.put('/repairs/:id', validateId('id'), adminController.updateRepair);

// =====================================================
// Export
// =====================================================

module.exports = router;
