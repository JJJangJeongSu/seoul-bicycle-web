/**
 * =====================================================
 * Authentication & Authorization Middleware
 * =====================================================
 *
 * JWT 기반 인증 미들웨어를 제공합니다.
 *
 * 주요 기능:
 * 1. JWT 토큰 검증
 * 2. 사용자 정보 추출 및 req.user에 할당
 * 3. 역할 기반 접근 제어 (role-based access control)
 * 4. 인증 오류 처리
 *
 * 사용 예시:
 * - router.get('/me', authenticate, userController.getMe)
 * - router.get('/admin/users', authenticate, requireRole('admin'), adminController.getUsers)
 */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

// =====================================================
// JWT 인증 미들웨어
// =====================================================

/**
 * JWT 토큰 인증 미들웨어
 *
 * Authorization 헤더에서 JWT 토큰을 추출하고 검증합니다.
 * 검증 성공 시 토큰 페이로드를 req.user에 할당합니다.
 *
 * Authorization 헤더 형식: "Bearer <token>"
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function authenticate(req, res, next) {
  try {
    // 1. Authorization 헤더 확인
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(
        res,
        'AUTH_TOKEN_MISSING',
        '인증 토큰이 제공되지 않았습니다.',
        401
      );
    }

    // 2. Bearer 토큰 형식 검증
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return sendError(
        res,
        'AUTH_TOKEN_INVALID_FORMAT',
        '잘못된 토큰 형식입니다. "Bearer <token>" 형식이어야 합니다.',
        401
      );
    }

    const token = parts[1];

    // 3. JWT 토큰 검증
    // TODO: 환경 변수에서 JWT_SECRET 가져오기
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(
          res,
          'AUTH_TOKEN_EXPIRED',
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
          401
        );
      }

      if (error.name === 'JsonWebTokenError') {
        return sendError(
          res,
          'AUTH_TOKEN_INVALID',
          '유효하지 않은 토큰입니다.',
          401
        );
      }

      throw error;
    }

    // 4. 토큰 페이로드에서 사용자 정보 추출
    // 페이로드 구조: { id, email, role, iat, exp }
    if (!decoded.id || !decoded.email || !decoded.role) {
      return sendError(
        res,
        'AUTH_TOKEN_INVALID_PAYLOAD',
        '토큰 페이로드가 유효하지 않습니다.',
        401
      );
    }

    // 5. req.user에 사용자 정보 할당
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    // TODO (선택): 데이터베이스에서 사용자 존재 여부 확인
    // - 사용자가 삭제되었거나 차단된 경우 처리
    // - 성능과 보안의 균형을 고려하여 필요시 구현

    next();
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 역할 기반 접근 제어 미들웨어
// =====================================================

/**
 * 역할 기반 접근 제어 미들웨어 팩토리 함수
 *
 * 특정 역할을 가진 사용자만 접근할 수 있도록 제한합니다.
 * authenticate 미들웨어 이후에 사용해야 합니다.
 *
 * @param {...string} allowedRoles - 허용할 역할 목록 ('admin', 'user')
 * @returns {Function} Express 미들웨어 함수
 *
 * @example
 * // 관리자만 접근 가능
 * router.get('/admin/users', authenticate, requireRole('admin'), adminController.getUsers)
 *
 * @example
 * // 일반 사용자만 접근 가능 (관리자 제외)
 * router.post('/rentals', authenticate, requireRole('user'), rentalsController.create)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      // 1. req.user 존재 확인 (authenticate 미들웨어 선행 확인)
      if (!req.user) {
        return sendError(
          res,
          'AUTH_REQUIRED',
          '인증이 필요합니다. authenticate 미들웨어를 먼저 사용하세요.',
          401
        );
      }

      // 2. 사용자 역할 확인
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return sendError(
          res,
          'FORBIDDEN',
          `이 작업을 수행할 권한이 없습니다. 필요한 역할: ${allowedRoles.join(', ')}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// =====================================================
// 선택적 인증 미들웨어
// =====================================================

/**
 * 선택적 인증 미들웨어
 *
 * 토큰이 제공되면 검증하고, 없으면 무시합니다.
 * 로그인 여부에 따라 다른 데이터를 반환하는 엔드포인트에 사용합니다.
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 토큰이 없으면 그냥 진행
    if (!authHeader) {
      return next();
    }

    // 토큰이 있으면 검증 (authenticate와 동일한 로직)
    const parts = authHeader.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1];
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

      try {
        const decoded = jwt.verify(token, jwtSecret);

        if (decoded.id && decoded.email && decoded.role) {
          req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          };
        }
      } catch (error) {
        // 토큰이 유효하지 않아도 에러를 던지지 않음
        console.warn('Invalid optional token:', error.message);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  authenticate,
  requireRole,
  optionalAuthenticate,
};
