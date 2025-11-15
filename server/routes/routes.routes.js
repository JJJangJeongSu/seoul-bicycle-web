/**
 * =====================================================
 * Routes Routes (Navigation & Path Finding)
 * =====================================================
 *
 * 경로 찾기 및 네비게이션 관련 라우트
 *
 * Base Path: /api/routes
 *
 * Endpoints:
 * - GET    /geocode    - 주소 -> 좌표 변환
 * - POST   /calculate  - 경로 계산
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const routesController = require('../controllers/routes.controller');

// 미들웨어 import
const { optionalAuthenticate } = require('../middleware/auth');
const {
  validateGeocode,
  validateCalculateRoute,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   GET /api/routes/geocode?address=서울특별시 강남구 테헤란로 427
 * @desc    주소를 좌표로 변환
 * @access  Public
 *
 * Query Params:
 * - address: string (required) - 변환할 주소
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "address": "서울특별시 강남구 테헤란로 427",
 *     "latitude": 37.507930,
 *     "longitude": 127.063663
 *   }
 * }
 */
router.get('/geocode', validateGeocode, routesController.geocode);

/**
 * @route   POST /api/routes/calculate
 * @desc    두 대여소 간의 경로 계산
 * @access  Public (로그인 선택)
 *
 * Request Body:
 * {
 *   "startStationId": "ST-001",
 *   "endStationId": "ST-002"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "route": {
 *       "startStation": {
 *         "id": "ST-001",
 *         "name": "강남역 1번출구",
 *         "latitude": 37.497900,
 *         "longitude": 127.027600
 *       },
 *       "endStation": {
 *         "id": "ST-002",
 *         "name": "역삼역 2번출구",
 *         "latitude": 37.500500,
 *         "longitude": 127.036500
 *       },
 *       "distance": 2.34,
 *       "duration": 12,
 *       "walkingDistanceToStart": 0.15,
 *       "walkingDistanceFromEnd": 0.08
 *     }
 *   }
 * }
 *
 * Note: 로그인한 사용자의 경우 검색 이력이 저장될 수 있습니다.
 */
router.post(
  '/calculate',
  optionalAuthenticate,
  validateCalculateRoute,
  routesController.calculate
);

// =====================================================
// Export
// =====================================================

module.exports = router;
