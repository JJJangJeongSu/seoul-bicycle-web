/**
 * =====================================================
 * Admin Controller
 * =====================================================
 *
 * 관리자 전용 기능 관련 비즈니스 로직 처리
 *
 * Functions:
 * - getStatistics    - 통계 대시보드
 * - getUsers         - 사용자 목록 조회
 * - updateUserStatus - 사용자 상태 변경
 * - getStations      - 대여소 관리
 * - getBikes         - 자전거 관리
 * - getRepairs       - 고장 신고 관리
 * - updateRepair     - 고장 신고 처리
 */

const { sendSuccess, sendError, calculatePagination } = require('../utils/response');
const UserModel = require('../models/User.model');
const StationModel = require('../models/Station.model');
const BikeModel = require('../models/Bike.model');
const RentalModel = require('../models/Rental.model');
const RepairModel = require('../models/Repair.model');

// =====================================================
// 통계 대시보드
// =====================================================

/**
 * 통계 대시보드 데이터 조회
 *
 * @route   GET /api/admin/statistics
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getStatistics(req, res, next) {
  try {
    // TODO: 1. 전체 통계 조회
    // const totalUsers = await UserModel.count();
    // const activeUsers = await UserModel.count({ status: 'active' });
    // const totalStations = await StationModel.count();
    // const totalBikes = await BikeModel.count();
    // const activeRentals = await RentalModel.count({ status: 'rented' });

    // TODO: 2. 대여 통계 조회
    // const today = new Date().toISOString().split('T')[0];
    // const thisWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    // const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    //
    // const rentalsToday = await RentalModel.countByDateRange(today, null);
    // const rentalsThisWeek = await RentalModel.countByDateRange(thisWeekStart, null);
    // const rentalsThisMonth = await RentalModel.countByDateRange(thisMonthStart, null);

    // TODO: 3. 고장 신고 통계 조회
    // const repairsPending = await RepairModel.count({ status: 'pending' });
    // const repairsInProgress = await RepairModel.count({ status: 'in-progress' });
    // const repairsCompleted = await RepairModel.count({ status: 'completed' });

    // Placeholder response
    return sendSuccess(res, {
      overview: {
        totalUsers: 1234,
        activeUsers: 1000,
        totalStations: 50,
        totalBikes: 500,
        activeRentals: 42,
      },
      rentalStats: {
        today: 120,
        thisWeek: 850,
        thisMonth: 3200,
      },
      repairStats: {
        pending: 5,
        inProgress: 3,
        completed: 42,
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 사용자 목록 조회
// =====================================================

/**
 * 사용자 목록 조회 (관리자용)
 *
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {number} req.query.page - 페이지 번호
 * @param {number} req.query.limit - 페이지당 항목 수
 * @param {string} req.query.role - 역할 필터
 * @param {string} req.query.status - 상태 필터
 * @param {string} req.query.search - 검색어
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    // TODO: 1. 필터 조건 구성
    // const filters = {};
    // if (role) filters.role = role;
    // if (status) filters.status = status;
    // if (search) filters.search = search; // 이름 또는 이메일 검색

    // TODO: 2. 사용자 목록 조회 (페이지네이션)
    // const offset = (page - 1) * limit;
    // const { users, totalCount } = await UserModel.findAll({
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // TODO: 3. 각 사용자의 대여 통계 조회 (선택)
    // for (const user of users) {
    //   const rentalCount = await RentalModel.count({ userId: user.id });
    //   const lastRental = await RentalModel.findLastByUser(user.id);
    //   user.rentalCount = rentalCount;
    //   user.lastRentalDate = lastRental?.rentalTime || null;
    // }

    // TODO: 4. 페이지네이션 정보 계산
    // const pagination = calculatePagination(totalCount, page, limit);

    // Placeholder response
    return sendSuccess(
      res,
      {
        users: [
          {
            id: '1',
            email: 'user@example.com',
            name: '홍길동',
            phone: '010-1234-5678',
            role: 'user',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            rentalCount: 42,
            lastRentalDate: '2024-11-15T10:30:00Z',
          },
        ],
      },
      200,
      {
        pagination: calculatePagination(1, page, limit),
      }
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 사용자 상태 변경
// =====================================================

/**
 * 사용자 상태 변경 (활성화/차단)
 *
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - 사용자 ID
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.status - 상태 (active | blocked)
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // TODO: 1. 사용자 존재 확인
    // const user = await UserModel.findById(id);
    // if (!user) {
    //   return sendError(res, 'USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 자기 자신을 차단하는 것 방지
    // if (req.user.id === id) {
    //   return sendError(res, 'CANNOT_BLOCK_SELF', '자기 자신을 차단할 수 없습니다.', 400);
    // }

    // TODO: 3. 관리자 계정 차단 방지 (선택)
    // if (user.role === 'admin' && status === 'blocked') {
    //   return sendError(res, 'CANNOT_BLOCK_ADMIN', '관리자 계정을 차단할 수 없습니다.', 400);
    // }

    // TODO: 4. 상태 업데이트
    // await UserModel.updateStatus(id, status);

    // Placeholder response
    return sendSuccess(res, {
      user: {
        id,
        status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 대여소 관리
// =====================================================

/**
 * 대여소 관리 (상세 정보 포함)
 *
 * @route   GET /api/admin/stations
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getStations(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query;

    // TODO: 1. 대여소 목록 조회 (페이지네이션)
    // const filters = {};
    // if (status) filters.status = status;
    //
    // const offset = (page - 1) * limit;
    // const { stations, totalCount } = await StationModel.findAll({
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // TODO: 2. 각 대여소의 대여 통계 조회
    // for (const station of stations) {
    //   const totalRentals = await RentalModel.countByStation(station.id);
    //   const lastRental = await RentalModel.findLastByStation(station.id);
    //   station.totalRentals = totalRentals;
    //   station.lastRentalTime = lastRental?.rentalTime || null;
    // }

    // Placeholder response
    return sendSuccess(
      res,
      {
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
            totalRentals: 1234,
            lastRentalTime: '2024-11-15T10:30:00Z',
          },
        ],
      },
      200,
      {
        pagination: calculatePagination(1, page, limit),
      }
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 자전거 관리
// =====================================================

/**
 * 자전거 관리 (상태별 조회)
 *
 * @route   GET /api/admin/bikes
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getBikes(req, res, next) {
  try {
    const { page = 1, limit = 20, status, stationId } = req.query;

    // TODO: 1. 자전거 목록 조회 (페이지네이션)
    // const filters = {};
    // if (status) filters.status = status;
    // if (stationId) filters.currentStationId = stationId;
    //
    // const offset = (page - 1) * limit;
    // const { bikes, totalCount } = await BikeModel.findAll({
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // TODO: 2. 각 자전거의 대여 통계 조회
    // for (const bike of bikes) {
    //   const totalRentals = await RentalModel.countByBike(bike.id);
    //   const lastRental = await RentalModel.findLastByBike(bike.id);
    //   bike.totalRentals = totalRentals;
    //   bike.lastRentalTime = lastRental?.rentalTime || null;
    // }

    // Placeholder response
    return sendSuccess(
      res,
      {
        bikes: [
          {
            id: 'SPB-00001',
            currentStationId: 'ST-001',
            status: 'available',
            model: 'Seoul Bike v2',
            totalRentals: 234,
            lastRentalTime: '2024-11-15T09:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
      },
      200,
      {
        pagination: calculatePagination(1, page, limit),
      }
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 고장 신고 관리
// =====================================================

/**
 * 고장 신고 관리 (전체 신고 조회)
 *
 * @route   GET /api/admin/repairs
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getRepairs(req, res, next) {
  try {
    const { page = 1, limit = 20, status, type } = req.query;

    // TODO: 1. 고장 신고 목록 조회 (페이지네이션)
    // const filters = {};
    // if (status) filters.status = status;
    // if (type) filters.type = type;
    //
    // const offset = (page - 1) * limit;
    // const { repairs, totalCount } = await RepairModel.findAll({
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // Placeholder response
    return sendSuccess(
      res,
      {
        repairs: [
          {
            id: 'REP-1731672000123',
            reporterId: 'user_id',
            reporterName: '홍길동',
            type: 'bike',
            bikeId: 'SPB-00001',
            stationId: null,
            category: 'brake',
            description: '브레이크가 작동하지 않습니다',
            status: 'pending',
            adminNote: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
          },
        ],
      },
      200,
      {
        pagination: calculatePagination(1, page, limit),
      }
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 고장 신고 처리
// =====================================================

/**
 * 고장 신고 상태 변경 및 메모 추가
 *
 * @route   PUT /api/admin/repairs/:id
 * @access  Private (Admin)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - 신고 ID
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.status - 상태 (in-progress | completed)
 * @param {string} req.body.adminNote - 관리자 메모
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function updateRepair(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    // TODO: 1. 신고 존재 확인
    // const repair = await RepairModel.findById(id);
    // if (!repair) {
    //   return sendError(res, 'REPAIR_NOT_FOUND', '신고 내역을 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 업데이트할 필드 구성
    // const updates = {};
    // if (status) updates.status = status;
    // if (adminNote) updates.adminNote = adminNote;
    // if (status === 'completed') updates.completedAt = new Date();

    // TODO: 3. 신고 정보 업데이트
    // await RepairModel.update(id, updates);

    // TODO: 4. 자전거 상태 업데이트 (수리 완료 시)
    // if (status === 'completed' && repair.type === 'bike') {
    //   await BikeModel.updateStatus(repair.bikeId, 'available');
    // }

    // Placeholder response
    return sendSuccess(res, {
      repair: {
        id,
        status,
        adminNote,
        completedAt: status === 'completed' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
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
  getStatistics,
  getUsers,
  updateUserStatus,
  getStations,
  getBikes,
  getRepairs,
  updateRepair,
};
