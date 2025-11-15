/**
 * =====================================================
 * Request Validation Middleware
 * =====================================================
 *
 * express-validator를 사용한 요청 데이터 검증 미들웨어입니다.
 *
 * 주요 기능:
 * 1. 요청 body, query, params 검증
 * 2. 재사용 가능한 검증 체인 제공
 * 3. 검증 에러 포맷팅
 * 4. 커스텀 검증 규칙
 *
 * 사용 예시:
 * router.post('/signup', validateSignup, authController.signup)
 * router.get('/users', validatePagination, userController.getUsers)
 */

const { body, query, param, validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

// =====================================================
// 검증 결과 처리 미들웨어
// =====================================================

/**
 * 검증 결과를 확인하고 에러가 있으면 응답
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 에러 메시지 포맷팅
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
      location: err.location,
    }));

    return sendError(
      res,
      'VALIDATION_ERROR',
      '입력 데이터가 유효하지 않습니다.',
      400,
      { errors: formattedErrors }
    );
  }

  next();
}

// =====================================================
// 공통 검증 체인
// =====================================================

/**
 * 이메일 검증
 */
const validateEmail = body('email')
  .trim()
  .notEmpty().withMessage('이메일은 필수 항목입니다.')
  .isEmail().withMessage('유효한 이메일 형식이 아닙니다.')
  .normalizeEmail()
  .isLength({ max: 255 }).withMessage('이메일은 255자 이하여야 합니다.');

/**
 * 비밀번호 검증 (회원가입용)
 */
const validatePassword = body('password')
  .notEmpty().withMessage('비밀번호는 필수 항목입니다.')
  .isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
  .isLength({ max: 100 }).withMessage('비밀번호는 100자 이하여야 합니다.');
  // TODO: 비밀번호 강도 검증 추가 가능
  // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('영문 대소문자, 숫자를 포함해야 합니다.');

/**
 * 이름 검증
 */
const validateName = body('name')
  .trim()
  .notEmpty().withMessage('이름은 필수 항목입니다.')
  .isLength({ min: 2, max: 100 }).withMessage('이름은 2자 이상 100자 이하여야 합니다.');

/**
 * 전화번호 검증 (한국 전화번호 형식)
 */
const validatePhone = body('phone')
  .trim()
  .notEmpty().withMessage('전화번호는 필수 항목입니다.')
  .matches(/^010-\d{4}-\d{4}$/).withMessage('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');

/**
 * 페이지네이션 검증
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('페이지당 항목 수는 1~100 사이여야 합니다.')
    .toInt(),
];

/**
 * ID 검증 (UUID 또는 특정 패턴)
 */
const validateId = (paramName = 'id') =>
  param(paramName)
    .trim()
    .notEmpty().withMessage(`${paramName}는 필수 항목입니다.`);

/**
 * 위도/경도 검증
 */
const validateCoordinates = [
  query('lat')
    .notEmpty().withMessage('위도는 필수 항목입니다.')
    .isFloat({ min: -90, max: 90 }).withMessage('위도는 -90 ~ 90 사이의 값이어야 합니다.')
    .toFloat(),

  query('lon')
    .notEmpty().withMessage('경도는 필수 항목입니다.')
    .isFloat({ min: -180, max: 180 }).withMessage('경도는 -180 ~ 180 사이의 값이어야 합니다.')
    .toFloat(),
];

// =====================================================
// 인증 관련 검증
// =====================================================

/**
 * 로그인 요청 검증
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('이메일은 필수 항목입니다.')
    .isEmail().withMessage('유효한 이메일 형식이 아닙니다.'),

  body('password')
    .notEmpty().withMessage('비밀번호는 필수 항목입니다.'),

  handleValidationErrors,
];

/**
 * 회원가입 요청 검증
 */
const validateSignup = [
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  handleValidationErrors,
];

/**
 * 이메일 중복 확인 검증
 */
const validateCheckEmail = [
  query('email')
    .trim()
    .notEmpty().withMessage('이메일은 필수 항목입니다.')
    .isEmail().withMessage('유효한 이메일 형식이 아닙니다.'),

  handleValidationErrors,
];

// =====================================================
// 대여소 관련 검증
// =====================================================

/**
 * 대여소 목록 조회 검증
 */
const validateGetStations = [
  query('district')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('구 이름은 50자 이하여야 합니다.'),

  query('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('상태는 active 또는 inactive여야 합니다.'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('검색어는 200자 이하여야 합니다.'),

  handleValidationErrors,
];

/**
 * 가장 가까운 대여소 찾기 검증
 */
const validateNearestStation = [
  ...validateCoordinates,
  handleValidationErrors,
];

// =====================================================
// 대여 관련 검증
// =====================================================

/**
 * 자전거 대여 요청 검증
 */
const validateCreateRental = [
  body('stationId')
    .trim()
    .notEmpty().withMessage('대여소 ID는 필수 항목입니다.')
    .matches(/^ST-\d{3}$/).withMessage('대여소 ID 형식이 올바르지 않습니다. (예: ST-001)'),

  handleValidationErrors,
];

/**
 * 자전거 반납 요청 검증
 */
const validateReturnRental = [
  param('rentalId')
    .trim()
    .notEmpty().withMessage('대여 ID는 필수 항목입니다.')
    .matches(/^R-\d+$/).withMessage('대여 ID 형식이 올바르지 않습니다. (예: R-123456789)'),

  body('endStationId')
    .trim()
    .notEmpty().withMessage('반납 대여소 ID는 필수 항목입니다.')
    .matches(/^ST-\d{3}$/).withMessage('대여소 ID 형식이 올바르지 않습니다.'),

  body('distance')
    .notEmpty().withMessage('이동 거리는 필수 항목입니다.')
    .isFloat({ min: 0, max: 999.99 }).withMessage('이동 거리는 0 ~ 999.99 사이의 값이어야 합니다.')
    .toFloat(),

  handleValidationErrors,
];

// =====================================================
// 게시판 관련 검증
// =====================================================

/**
 * 게시글 생성 검증
 */
const validateCreatePost = [
  body('category')
    .notEmpty().withMessage('카테고리는 필수 항목입니다.')
    .isIn(['notice', 'info', 'question', 'free']).withMessage('유효한 카테고리가 아닙니다.'),

  body('title')
    .trim()
    .notEmpty().withMessage('제목은 필수 항목입니다.')
    .isLength({ min: 1, max: 500 }).withMessage('제목은 1자 이상 500자 이하여야 합니다.'),

  body('content')
    .trim()
    .notEmpty().withMessage('내용은 필수 항목입니다.')
    .isLength({ min: 1 }).withMessage('내용은 최소 1자 이상이어야 합니다.'),

  handleValidationErrors,
];

/**
 * 게시글 목록 조회 검증
 */
const validateGetPosts = [
  query('category')
    .optional()
    .isIn(['notice', 'info', 'question', 'free']).withMessage('유효한 카테고리가 아닙니다.'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('검색어는 200자 이하여야 합니다.'),

  ...validatePagination,
  handleValidationErrors,
];

// =====================================================
// 고장 신고 관련 검증
// =====================================================

/**
 * 고장 신고 생성 검증
 */
const validateCreateRepair = [
  body('type')
    .notEmpty().withMessage('신고 타입은 필수 항목입니다.')
    .isIn(['bike', 'station']).withMessage('타입은 bike 또는 station이어야 합니다.'),

  body('bikeId')
    .if(body('type').equals('bike'))
    .notEmpty().withMessage('자전거 타입일 때 자전거 ID는 필수입니다.')
    .matches(/^SPB-\d{5}$/).withMessage('자전거 ID 형식이 올바르지 않습니다. (예: SPB-00001)'),

  body('stationId')
    .if(body('type').equals('station'))
    .notEmpty().withMessage('대여소 타입일 때 대여소 ID는 필수입니다.')
    .matches(/^ST-\d{3}$/).withMessage('대여소 ID 형식이 올바르지 않습니다.'),

  body('category')
    .notEmpty().withMessage('고장 카테고리는 필수 항목입니다.')
    .isIn(['brake', 'tire', 'chain', 'light', 'seat', 'bell', 'other'])
    .withMessage('유효한 카테고리가 아닙니다.'),

  body('description')
    .trim()
    .notEmpty().withMessage('설명은 필수 항목입니다.')
    .isLength({ min: 10 }).withMessage('설명은 최소 10자 이상이어야 합니다.'),

  handleValidationErrors,
];

// =====================================================
// 경로 관련 검증
// =====================================================

/**
 * 경로 계산 요청 검증
 */
const validateCalculateRoute = [
  body('startStationId')
    .trim()
    .notEmpty().withMessage('출발 대여소 ID는 필수 항목입니다.')
    .matches(/^ST-\d{3}$/).withMessage('대여소 ID 형식이 올바르지 않습니다.'),

  body('endStationId')
    .trim()
    .notEmpty().withMessage('도착 대여소 ID는 필수 항목입니다.')
    .matches(/^ST-\d{3}$/).withMessage('대여소 ID 형식이 올바르지 않습니다.'),

  handleValidationErrors,
];

/**
 * 주소 -> 좌표 변환 검증
 */
const validateGeocode = [
  query('address')
    .trim()
    .notEmpty().withMessage('주소는 필수 항목입니다.')
    .isLength({ min: 5, max: 500 }).withMessage('주소는 5자 이상 500자 이하여야 합니다.'),

  handleValidationErrors,
];

// =====================================================
// 사용자 관련 검증
// =====================================================

/**
 * 프로필 수정 검증
 */
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('이름은 2자 이상 100자 이하여야 합니다.'),

  body('phone')
    .optional()
    .trim()
    .matches(/^010-\d{4}-\d{4}$/).withMessage('전화번호 형식이 올바르지 않습니다.'),

  handleValidationErrors,
];

/**
 * 비밀번호 변경 검증
 */
const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('현재 비밀번호는 필수 항목입니다.'),

  body('newPassword')
    .notEmpty().withMessage('새 비밀번호는 필수 항목입니다.')
    .isLength({ min: 6 }).withMessage('새 비밀번호는 최소 6자 이상이어야 합니다.')
    .isLength({ max: 100 }).withMessage('새 비밀번호는 100자 이하여야 합니다.'),

  handleValidationErrors,
];

// =====================================================
// 관리자 관련 검증
// =====================================================

/**
 * 사용자 상태 변경 검증 (관리자)
 */
const validateUpdateUserStatus = [
  param('userId')
    .trim()
    .notEmpty().withMessage('사용자 ID는 필수 항목입니다.'),

  body('status')
    .notEmpty().withMessage('상태는 필수 항목입니다.')
    .isIn(['active', 'blocked']).withMessage('상태는 active 또는 blocked여야 합니다.'),

  handleValidationErrors,
];

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  // 핸들러
  handleValidationErrors,

  // 공통 검증
  validatePagination,
  validateId,
  validateCoordinates,

  // 인증
  validateLogin,
  validateSignup,
  validateCheckEmail,

  // 대여소
  validateGetStations,
  validateNearestStation,

  // 대여
  validateCreateRental,
  validateReturnRental,

  // 게시판
  validateCreatePost,
  validateGetPosts,

  // 고장 신고
  validateCreateRepair,

  // 경로
  validateCalculateRoute,
  validateGeocode,

  // 사용자
  validateUpdateProfile,
  validateChangePassword,

  // 관리자
  validateUpdateUserStatus,
};
