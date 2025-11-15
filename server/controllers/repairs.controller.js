/**
 * =====================================================
 * Repairs Controller
 * =====================================================
 *
 * 고장 신고 관련 비즈니스 로직 처리
 *
 * Functions:
 * - getMy   - 내 신고 내역 조회
 * - create  - 고장 신고 접수
 * - getById - 신고 상세 조회
 */

const { sendSuccess, sendError, calculatePagination } = require('../utils/response');
const RepairModel = require('../models/Repair.model');
const BikeModel = require('../models/Bike.model');
const StationModel = require('../models/Station.model');

// =====================================================
// 내 신고 내역 조회
// =====================================================

/**
 * 내 신고 내역 조회
 *
 * @route   GET /api/repairs/my
 * @access  Private
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.query - 쿼리 파라미터
 * @param {number} req.query.page - 페이지 번호
 * @param {number} req.query.limit - 페이지당 항목 수
 * @param {string} req.query.status - 상태 필터
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getMy(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    // TODO: 1. 내 신고 내역 조회 (페이지네이션)
    // const filters = { reporterId: userId };
    // if (status) filters.status = status;
    //
    // const offset = (page - 1) * limit;
    // const { repairs, totalCount } = await RepairModel.findByReporter(userId, {
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // TODO: 2. 페이지네이션 정보 계산
    // const pagination = calculatePagination(totalCount, page, limit);

    // Placeholder response
    return sendSuccess(
      res,
      {
        repairs: [
          {
            id: 'REP-1731672000123',
            reporterId: userId,
            reporterName: req.user.name || '사용자',
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
// 고장 신고 접수
// =====================================================

/**
 * 고장 신고 접수
 *
 * @route   POST /api/repairs
 * @access  Private
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.type - 신고 타입 (bike | station)
 * @param {string} req.body.bikeId - 자전거 ID (type=bike일 때)
 * @param {string} req.body.stationId - 대여소 ID (type=station일 때)
 * @param {string} req.body.category - 고장 카테고리
 * @param {string} req.body.description - 고장 설명
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function create(req, res, next) {
  try {
    const { type, bikeId, stationId, category, description } = req.body;
    const userId = req.user.id;

    // TODO: 1. 신고 대상 존재 여부 확인
    // if (type === 'bike') {
    //   const bike = await BikeModel.findById(bikeId);
    //   if (!bike) {
    //     return sendError(res, 'BIKE_NOT_FOUND', '자전거를 찾을 수 없습니다.', 404);
    //   }
    // } else if (type === 'station') {
    //   const station = await StationModel.findById(stationId);
    //   if (!station) {
    //     return sendError(res, 'STATION_NOT_FOUND', '대여소를 찾을 수 없습니다.', 404);
    //   }
    // }

    // TODO: 2. 사용자 이름 조회 (reporter_name 필드에 스냅샷 저장)
    // const user = await UserModel.findById(userId);

    // TODO: 3. 신고 ID 생성 (예: REP-1731672000123)
    // const repairId = generateRepairId(); // 'REP-' + timestamp

    // TODO: 4. 신고 정보 저장
    // const repair = await RepairModel.create({
    //   id: repairId,
    //   reporterId: userId,
    //   reporterName: user.name,
    //   type,
    //   bikeId: type === 'bike' ? bikeId : null,
    //   stationId: type === 'station' ? stationId : null,
    //   category,
    //   description,
    //   status: 'pending',
    // });

    // TODO: 5. 자전거 고장 신고 시 자전거 상태를 'broken'으로 변경 (선택)
    // if (type === 'bike') {
    //   await BikeModel.updateStatus(bikeId, 'broken');
    // }

    // Placeholder response
    return sendSuccess(
      res,
      {
        repair: {
          id: 'REP-1731672000123',
          reporterId: userId,
          reporterName: req.user.name || '사용자',
          type,
          bikeId: type === 'bike' ? bikeId : null,
          stationId: type === 'station' ? stationId : null,
          category,
          description,
          status: 'pending',
          adminNote: null,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 신고 상세 조회
// =====================================================

/**
 * 신고 상세 조회
 *
 * @route   GET /api/repairs/:id
 * @access  Private (신고자 또는 관리자)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - 신고 ID
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // TODO: 1. 신고 정보 조회
    // const repair = await RepairModel.findById(id);
    // if (!repair) {
    //   return sendError(res, 'REPAIR_NOT_FOUND', '신고 내역을 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 권한 확인 (신고자 또는 관리자만 조회 가능)
    // if (repair.reporterId !== userId && userRole !== 'admin') {
    //   return sendError(res, 'FORBIDDEN', '신고 내역을 조회할 권한이 없습니다.', 403);
    // }

    // Placeholder response
    return sendSuccess(res, {
      repair: {
        id,
        reporterId: userId,
        reporterName: '홍길동',
        type: 'bike',
        bikeId: 'SPB-00001',
        stationId: null,
        category: 'brake',
        description: '브레이크가 작동하지 않습니다',
        status: 'in-progress',
        adminNote: '수리 진행 중입니다',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        completedAt: null,
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
  getMy,
  create,
  getById,
};
