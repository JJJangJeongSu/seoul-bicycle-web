/**
 * =====================================================
 * Stations Routes
 * =====================================================
 *
 * 대여소 관련 라우트
 *
 * Base Path: /api/stations
 *
 * Endpoints:
 * - GET    /              - 대여소 목록 조회
 * - GET    /status        - 대여소 실시간 현황
 * - GET    /nearest       - 가장 가까운 대여소 찾기
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const stationsController = require('../controllers/stations.controller');

// 검증 미들웨어 import
const {
  validateGetStations,
  validateNearestStation,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   GET /api/stations
 * @desc    대여소 목록 조회
 * @access  Public
 *
 * Query Params:
 * - district: string (optional) - 구 이름 필터 (예: 강남구)
 * - status: string (optional) - 운영 상태 필터 (active | inactive)
 * - search: string (optional) - 대여소명 또는 주소 검색어
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "stations": [
 *       {
 *         "id": "ST-001",
 *         "name": "강남역 1번출구",
 *         "address": "서울특별시 강남구...",
 *         "latitude": 37.497900,
 *         "longitude": 127.027600,
 *         "bikeCount": 12,
 *         "capacity": 20,
 *         "status": "active"
 *       }
 *     ]
 *   }
 * }
 */
router.get('/', validateGetStations, stationsController.getAll);

/**
 * @route   GET /api/stations/status
 * @desc    대여소 실시간 현황 조회
 * @access  Public
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "stations": [
 *       {
 *         "id": "ST-001",
 *         "bikeCount": 12,
 *         "status": "active"
 *       }
 *     ],
 *     "lastUpdated": "2024-11-15T10:30:00Z"
 *   }
 * }
 */
router.get('/status', stationsController.getStatus);

/**
 * @route   GET /api/stations/nearest?lat=37.4979&lon=127.0276
 * @desc    가장 가까운 대여소 찾기
 * @access  Public
 *
 * Query Params:
 * - lat: number (required) - 위도
 * - lon: number (required) - 경도
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "station": {
 *       "id": "ST-001",
 *       "name": "강남역 1번출구",
 *       "distance": 0.23,
 *       ...
 *     }
 *   }
 * }
 */
router.get('/nearest', validateNearestStation, stationsController.getNearest);

// =====================================================
// Export
// =====================================================

module.exports = router;
