/**
 * =====================================================
 * Rentals Controller
 * =====================================================
 *
 * 자전거 대여/반납 관련 비즈니스 로직 처리
 *
 * Functions:
 * - create         - 자전거 대여
 * - returnBike     - 자전거 반납
 * - getUserRentals - 사용자 대여 이력 조회
 */

const { sendSuccess, sendError } = require('../utils/response');
const { calculatePagination } = require('../utils/response');
const RentalModel = require('../models/Rental.model');
const BikeModel = require('../models/Bike.model');
const StationModel = require('../models/Station.model');

// =====================================================
// 자전거 대여
// =====================================================

/**
 * 자전거 대여
 *
 * @route   POST /api/rentals
 * @access  Private (일반 사용자만)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.stationId - 대여소 ID
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function create(req, res, next) {
  try {
    const { stationId } = req.body;
    const userId = req.user.id;

    // TODO: 1. 사용자가 이미 대여 중인지 확인
    // const activeRental = await RentalModel.findActiveByUserId(userId);
    // if (activeRental) {
    //   return sendError(res, 'RENTAL_ALREADY_ACTIVE', '이미 대여 중인 자전거가 있습니다.', 400);
    // }

    // TODO: 2. 대여소 존재 여부 및 상태 확인
    // const station = await StationModel.findById(stationId);
    // if (!station) {
    //   return sendError(res, 'STATION_NOT_FOUND', '대여소를 찾을 수 없습니다.', 404);
    // }
    // if (station.status !== 'active') {
    //   return sendError(res, 'STATION_INACTIVE', '현재 운영 중이지 않은 대여소입니다.', 400);
    // }

    // TODO: 3. 대여 가능한 자전거 찾기
    // const availableBike = await BikeModel.findAvailableAtStation(stationId);
    // if (!availableBike) {
    //   return sendError(res, 'BIKE_NOT_AVAILABLE', '대여 가능한 자전거가 없습니다.', 400);
    // }

    // TODO: 4. 트랜잭션 시작
    // - 자전거 상태를 'rented'로 변경
    // - 자전거의 current_station_id를 NULL로 설정
    // - 대여소의 bike_count 감소
    // - rentals 테이블에 새 레코드 생성

    // TODO: 5. 대여 ID 생성 (예: R-1731672000123)
    // const rentalId = generateRentalId(); // 'R-' + timestamp

    // TODO: 6. 대여 정보 저장
    // const rental = await RentalModel.create({
    //   id: rentalId,
    //   userId,
    //   bikeId: availableBike.id,
    //   startStationId: stationId,
    //   rentalTime: new Date(),
    //   status: 'rented',
    // });

    // Placeholder response
    return sendSuccess(
      res,
      {
        rental: {
          id: 'R-1731672000123',
          userId,
          bikeId: 'SPB-00001',
          startStationId: stationId,
          rentalTime: new Date().toISOString(),
          status: 'rented',
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 자전거 반납
// =====================================================

/**
 * 자전거 반납
 *
 * @route   PUT /api/rentals/:rentalId/return
 * @access  Private (일반 사용자만)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.rentalId - 대여 ID
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.endStationId - 반납 대여소 ID
 * @param {number} req.body.distance - 이동 거리 (km)
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function returnBike(req, res, next) {
  try {
    const { rentalId } = req.params;
    const { endStationId, distance } = req.body;
    const userId = req.user.id;

    // TODO: 1. 대여 정보 조회
    // const rental = await RentalModel.findById(rentalId);
    // if (!rental) {
    //   return sendError(res, 'RENTAL_NOT_FOUND', '대여 정보를 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 대여자 본인 확인
    // if (rental.userId !== userId) {
    //   return sendError(res, 'FORBIDDEN', '본인의 대여만 반납할 수 있습니다.', 403);
    // }

    // TODO: 3. 이미 반납된 대여인지 확인
    // if (rental.status === 'returned') {
    //   return sendError(res, 'RENTAL_ALREADY_RETURNED', '이미 반납된 대여입니다.', 400);
    // }

    // TODO: 4. 반납 대여소 확인
    // const endStation = await StationModel.findById(endStationId);
    // if (!endStation) {
    //   return sendError(res, 'STATION_NOT_FOUND', '반납 대여소를 찾을 수 없습니다.', 404);
    // }
    // if (endStation.status !== 'active') {
    //   return sendError(res, 'STATION_INACTIVE', '현재 운영 중이지 않은 대여소입니다.', 400);
    // }

    // TODO: 5. 대여소 용량 확인
    // if (endStation.bikeCount >= endStation.capacity) {
    //   return sendError(res, 'STATION_FULL', '대여소가 가득 찼습니다. 다른 대여소를 이용해주세요.', 400);
    // }

    // TODO: 6. 이용 시간 계산 (분 단위)
    // const rentalTime = new Date(rental.rentalTime);
    // const returnTime = new Date();
    // const duration = Math.floor((returnTime - rentalTime) / 1000 / 60); // 분 단위

    // TODO: 7. 트랜잭션으로 반납 처리
    // - rentals 테이블 업데이트: endStationId, returnTime, duration, distance, status='returned'
    // - bikes 테이블 업데이트: status='available', currentStationId=endStationId
    // - stations 테이블 업데이트: bike_count 증가

    // TODO: 8. 업데이트된 대여 정보 조회
    // const updatedRental = await RentalModel.findById(rentalId);

    // Placeholder response
    return sendSuccess(res, {
      rental: {
        id: rentalId,
        userId,
        bikeId: 'SPB-00001',
        startStationId: 'ST-001',
        endStationId,
        rentalTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
        returnTime: new Date().toISOString(),
        duration: 30, // 분
        distance,
        status: 'returned',
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 사용자 대여 이력 조회
// =====================================================

/**
 * 사용자 대여 이력 조회
 *
 * @route   GET /api/rentals/users/:userId/rentals
 * @access  Private (본인 또는 관리자)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.userId - 사용자 ID
 * @param {Object} req.query - 쿼리 파라미터
 * @param {number} req.query.page - 페이지 번호
 * @param {number} req.query.limit - 페이지당 항목 수
 * @param {string} req.query.status - 대여 상태 필터
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getUserRentals(req, res, next) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    // TODO: 1. 권한 확인 (본인 또는 관리자만 조회 가능)
    // if (req.user.id !== userId && req.user.role !== 'admin') {
    //   return sendError(res, 'FORBIDDEN', '다른 사용자의 대여 이력을 조회할 수 없습니다.', 403);
    // }

    // TODO: 2. 대여 이력 조회 (페이지네이션)
    // const filters = { userId };
    // if (status) filters.status = status;
    //
    // const offset = (page - 1) * limit;
    // const { rentals, totalCount } = await RentalModel.findByUser(userId, {
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // TODO: 3. 통계 계산
    // const statistics = await RentalModel.getUserStatistics(userId);
    // - totalRentals: 총 대여 횟수
    // - totalDistance: 총 이동 거리 (km)
    // - totalDuration: 총 이용 시간 (분)

    // TODO: 4. 페이지네이션 정보 계산
    // const pagination = calculatePagination(totalCount, page, limit);

    // Placeholder response
    return sendSuccess(
      res,
      {
        rentals: [
          {
            id: 'R-1731672000123',
            userId,
            bikeId: 'SPB-00001',
            startStationId: 'ST-001',
            startStationName: '강남역 1번출구',
            endStationId: 'ST-002',
            endStationName: '역삼역 2번출구',
            rentalTime: '2024-11-15T10:00:00Z',
            returnTime: '2024-11-15T10:30:00Z',
            duration: 30,
            distance: 2.34,
            status: 'returned',
          },
        ],
        statistics: {
          totalRentals: 42,
          totalDistance: 123.45,
          totalDuration: 1234,
        },
      },
      200,
      {
        pagination: calculatePagination(42, page, limit),
      }
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// Export
// =====================================================

module.exports = {
  create,
  returnBike,
  getUserRentals,
};
