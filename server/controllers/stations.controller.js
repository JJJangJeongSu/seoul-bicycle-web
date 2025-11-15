/**
 * =====================================================
 * Stations Controller
 * =====================================================
 *
 * 대여소 관련 비즈니스 로직 처리
 *
 * Functions:
 * - getAll     - 대여소 목록 조회
 * - getStatus  - 대여소 실시간 현황
 * - getNearest - 가장 가까운 대여소 찾기
 */

const { sendSuccess, sendError } = require('../utils/response');
const StationModel = require('../models/Station.model');

// =====================================================
// 대여소 목록 조회
// =====================================================

/**
 * 대여소 목록 조회
 *
 * @route   GET /api/stations
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {string} req.query.district - 구 이름 필터 (optional)
 * @param {string} req.query.status - 운영 상태 필터 (optional)
 * @param {string} req.query.search - 검색어 (optional)
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getAll(req, res, next) {
  try {
    const { district, status, search } = req.query;

    // TODO: 1. 필터 조건에 맞는 대여소 조회
    // const filters = {};
    // if (district) filters.district = district;
    // if (status) filters.status = status;
    // if (search) filters.search = search;

    // const stations = await StationModel.findAll(filters);

    // TODO: 2. 각 대여소별 현재 자전거 수 조회
    // - bikes 테이블에서 current_station_id로 그룹화하여 카운트
    // - 또는 stations.bike_count 필드 사용 (이미 계산된 값)

    // Placeholder response
    return sendSuccess(res, {
      stations: [
        {
          id: 'ST-001',
          name: '강남역 1번출구',
          address: '서울특별시 강남구 강남대로 396',
          latitude: 37.4979,
          longitude: 127.0276,
          bikeCount: 12,
          capacity: 20,
          status: 'active',
        },
        {
          id: 'ST-002',
          name: '역삼역 2번출구',
          address: '서울특별시 강남구 테헤란로 147',
          latitude: 37.5005,
          longitude: 127.0365,
          bikeCount: 8,
          capacity: 15,
          status: 'active',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 대여소 실시간 현황
// =====================================================

/**
 * 대여소 실시간 현황 조회
 *
 * @route   GET /api/stations/status
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getStatus(req, res, next) {
  try {
    // TODO: 1. 모든 대여소의 ID, bikeCount, status만 조회
    // const stationsStatus = await StationModel.findAllStatus();

    // TODO: 2. 마지막 업데이트 시간 포함
    // const lastUpdated = new Date().toISOString();

    // Placeholder response
    return sendSuccess(res, {
      stations: [
        { id: 'ST-001', bikeCount: 12, status: 'active' },
        { id: 'ST-002', bikeCount: 8, status: 'active' },
        { id: 'ST-003', bikeCount: 15, status: 'active' },
      ],
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 가장 가까운 대여소 찾기
// =====================================================

/**
 * Haversine 공식을 사용하여 두 지점 간의 거리 계산 (km)
 *
 * @param {number} lat1 - 시작점 위도
 * @param {number} lon1 - 시작점 경도
 * @param {number} lat2 - 끝점 위도
 * @param {number} lon2 - 끝점 경도
 * @returns {number} 거리 (km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // 소수점 2자리로 반올림
}

/**
 * 가장 가까운 대여소 찾기
 *
 * @route   GET /api/stations/nearest
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {number} req.query.lat - 위도
 * @param {number} req.query.lon - 경도
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getNearest(req, res, next) {
  try {
    const { lat, lon } = req.query;

    // TODO: 1. 모든 활성 대여소 조회
    // const stations = await StationModel.findAll({ status: 'active' });

    // TODO: 2. 각 대여소와의 거리 계산
    // const stationsWithDistance = stations.map((station) => ({
    //   ...station,
    //   distance: calculateDistance(lat, lon, station.latitude, station.longitude),
    // }));

    // TODO: 3. 거리순 정렬 후 가장 가까운 대여소 반환
    // stationsWithDistance.sort((a, b) => a.distance - b.distance);
    // const nearest = stationsWithDistance[0];

    // if (!nearest) {
    //   return sendError(res, 'STATION_NOT_FOUND', '근처에 대여소가 없습니다.', 404);
    // }

    // Placeholder response
    return sendSuccess(res, {
      station: {
        id: 'ST-001',
        name: '강남역 1번출구',
        address: '서울특별시 강남구 강남대로 396',
        latitude: 37.4979,
        longitude: 127.0276,
        bikeCount: 12,
        capacity: 20,
        status: 'active',
        distance: 0.23, // km
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// Export
// =====================================================

module.exports = {
  getAll,
  getStatus,
  getNearest,
};
