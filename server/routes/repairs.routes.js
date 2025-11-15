/**
 * =====================================================
 * Repairs Routes
 * =====================================================
 *
 * 자전거 및 대여소 고장 신고 관련 라우트
 *
 * Base Path: /api/repairs
 *
 * Endpoints:
 * - GET    /my     - 내 신고 내역 조회
 * - POST   /       - 고장 신고 접수
 * - GET    /:id    - 신고 상세 조회
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const repairsController = require('../controllers/repairs.controller');

// 미들웨어 import
const { authenticate } = require('../middleware/auth');
const {
  validateCreateRepair,
  validatePagination,
  validateId,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   GET /api/repairs/my
 * @desc    내 신고 내역 조회
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Query Params:
 * - page: number (optional, default: 1)
 * - limit: number (optional, default: 20)
 * - status: string (optional) - pending | in-progress | completed
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
 *         "stationId": null,
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
router.get('/my', authenticate, validatePagination, repairsController.getMy);

/**
 * @route   POST /api/repairs
 * @desc    고장 신고 접수
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Request Body (자전거 고장):
 * {
 *   "type": "bike",
 *   "bikeId": "SPB-00001",
 *   "category": "brake",
 *   "description": "브레이크가 작동하지 않습니다"
 * }
 *
 * Request Body (대여소 고장):
 * {
 *   "type": "station",
 *   "stationId": "ST-001",
 *   "category": "other",
 *   "description": "잠금 장치가 고장났습니다"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "repair": {
 *       "id": "REP-123456789",
 *       "reporterId": "user_id",
 *       "reporterName": "홍길동",
 *       "type": "bike",
 *       "bikeId": "SPB-00001",
 *       "category": "brake",
 *       "description": "브레이크가 작동하지 않습니다",
 *       "status": "pending",
 *       "createdAt": "2024-11-15T10:30:00Z"
 *     }
 *   }
 * }
 */
router.post('/', authenticate, validateCreateRepair, repairsController.create);

/**
 * @route   GET /api/repairs/:id
 * @desc    신고 상세 조회
 * @access  Private (신고자 또는 관리자)
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Path Params:
 * - id: string (예: REP-123456789)
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "repair": {
 *       "id": "REP-123456789",
 *       "reporterId": "user_id",
 *       "reporterName": "홍길동",
 *       "type": "bike",
 *       "bikeId": "SPB-00001",
 *       "category": "brake",
 *       "description": "브레이크가 작동하지 않습니다",
 *       "status": "in-progress",
 *       "adminNote": "수리 진행 중입니다",
 *       "createdAt": "2024-11-15T10:30:00Z",
 *       "completedAt": null
 *     }
 *   }
 * }
 */
router.get('/:id', authenticate, validateId('id'), repairsController.getById);

// =====================================================
// Export
// =====================================================

module.exports = router;
