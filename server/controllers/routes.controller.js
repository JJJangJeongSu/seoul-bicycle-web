/**
 * =====================================================
 * Routes Controller (Navigation & Path Finding)
 * =====================================================
 *
 * 경로 찾기 및 네비게이션 관련 비즈니스 로직 처리
 *
 * Functions:
 * - geocode   - 주소 -> 좌표 변환
 * - calculate - 경로 계산
 */

const { sendSuccess, sendError } = require('../utils/response');
const RouteModel = require('../models/Route.model');
const StationModel = require('../models/Station.model');

// =====================================================
// 주소 -> 좌표 변환 (Geocoding)
// =====================================================

/**
 * 주소를 좌표로 변환
 *
 * @route   GET /api/routes/geocode
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {string} req.query.address - 변환할 주소
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function geocode(req, res, next) {
  try {
    const { address } = req.query;

    // TODO: 1. 외부 지오코딩 API 호출
    // - Google Maps Geocoding API
    // - Kakao Local API
    // - Naver Maps Geocoding API
    // 등을 사용하여 주소를 좌표로 변환

    // TODO: 2. API 호출 예시 (Kakao Local API)
    // const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
    //   params: { query: address },
    //   headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` },
    // });

    // TODO: 3. 응답 파싱
    // const { documents } = response.data;
    // if (!documents || documents.length === 0) {
    //   return sendError(res, 'GEOCODE_NOT_FOUND', '주소를 찾을 수 없습니다.', 404);
    // }

    // const { x: longitude, y: latitude } = documents[0];

    // Placeholder response
    return sendSuccess(res, {
      address,
      latitude: 37.5079,
      longitude: 127.0636,
    });
  } catch (error) {
    // API 호출 실패 시 에러 처리
    if (error.response) {
      return sendError(
        res,
        'GEOCODE_API_ERROR',
        '지오코딩 API 호출에 실패했습니다.',
        500
      );
    }
    next(error);
  }
}

// =====================================================
// 경로 계산
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

  return Math.round(distance * 100) / 100; // 소수점 2자리
}

/**
 * 자전거 평균 속도를 기준으로 소요 시간 계산 (분)
 *
 * @param {number} distance - 거리 (km)
 * @param {number} avgSpeed - 평균 속도 (km/h), 기본값: 15 km/h
 * @returns {number} 소요 시간 (분)
 */
function calculateDuration(distance, avgSpeed = 15) {
  const hours = distance / avgSpeed;
  const minutes = Math.ceil(hours * 60);
  return minutes;
}

/**
 * 두 대여소 간의 경로 계산
 *
 * @route   POST /api/routes/calculate
 * @access  Public (로그인 선택)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보 (선택)
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.startStationId - 출발 대여소 ID
 * @param {string} req.body.endStationId - 도착 대여소 ID
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function calculate(req, res, next) {
  try {
    const { startStationId, endStationId } = req.body;
    const userId = req.user?.id || null; // 로그인 선택

    // TODO: 1. 출발/도착 대여소 조회
    // const startStation = await StationModel.findById(startStationId);
    // const endStation = await StationModel.findById(endStationId);

    // if (!startStation) {
    //   return sendError(res, 'START_STATION_NOT_FOUND', '출발 대여소를 찾을 수 없습니다.', 404);
    // }
    // if (!endStation) {
    //   return sendError(res, 'END_STATION_NOT_FOUND', '도착 대여소를 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 거리 및 소요 시간 계산
    // const distance = calculateDistance(
    //   startStation.latitude,
    //   startStation.longitude,
    //   endStation.latitude,
    //   endStation.longitude
    // );
    // const duration = calculateDuration(distance);

    // TODO: 3. 도보 거리 계산 (선택)
    // - 사용자 현재 위치 -> 출발 대여소 도보 거리
    // - 도착 대여소 -> 목적지 도보 거리
    // 현재는 임의의 값으로 설정

    // TODO: 4. 경로 검색 이력 저장 (로그인한 사용자만)
    // if (userId) {
    //   await RouteModel.create({
    //     userId,
    //     startStationId,
    //     endStationId,
    //     distance,
    //     duration,
    //     walkingDistanceToStart: 0.15,
    //     walkingDistanceFromEnd: 0.08,
    //   });
    // }

    // Placeholder response
    return sendSuccess(res, {
      route: {
        startStation: {
          id: startStationId,
          name: '강남역 1번출구',
          latitude: 37.4979,
          longitude: 127.0276,
        },
        endStation: {
          id: endStationId,
          name: '역삼역 2번출구',
          latitude: 37.5005,
          longitude: 127.0365,
        },
        distance: 2.34, // km
        duration: 12, // 분
        walkingDistanceToStart: 0.15, // km
        walkingDistanceFromEnd: 0.08, // km
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
  geocode,
  calculate,
};
