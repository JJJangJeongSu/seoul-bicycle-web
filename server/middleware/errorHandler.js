/**
 * =====================================================
 * Central Error Handler Middleware
 * =====================================================
 *
 * 애플리케이션 전역 에러 처리 미들웨어입니다.
 *
 * 주요 기능:
 * 1. 다양한 에러 타입 처리 (ValidationError, DatabaseError, etc)
 * 2. 일관된 에러 응답 형식 제공
 * 3. 에러 로깅
 * 4. 프로덕션 환경에서 민감한 정보 숨김
 *
 * 사용법:
 * - server.js의 모든 라우트 정의 이후에 등록
 * - app.use(errorHandler);
 */

const { sendError } = require('../utils/response');

// =====================================================
// 에러 타입 정의
// =====================================================

/**
 * 사용자 정의 에러 클래스들
 * 컨트롤러나 모델에서 특정 에러를 던질 때 사용
 */

class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

class AuthenticationError extends Error {
  constructor(message = '인증에 실패했습니다.') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
    this.code = 'AUTHENTICATION_ERROR';
  }
}

class AuthorizationError extends Error {
  constructor(message = '권한이 없습니다.') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
    this.code = 'AUTHORIZATION_ERROR';
  }
}

class NotFoundError extends Error {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
  }
}

class ConflictError extends Error {
  constructor(message = '리소스 충돌이 발생했습니다.') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.code = 'CONFLICT';
  }
}

class DatabaseError extends Error {
  constructor(message = '데이터베이스 오류가 발생했습니다.', originalError = null) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
    this.code = 'DATABASE_ERROR';
    this.originalError = originalError;
  }
}

// =====================================================
// 에러 로거
// =====================================================

/**
 * 에러 로깅 함수
 *
 * @param {Error} error - 에러 객체
 * @param {Object} req - Express request 객체
 */
function logError(error, req) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userId = req.user?.id || 'anonymous';

  console.error('\n===========================================');
  console.error(`[ERROR] ${timestamp}`);
  console.error(`Method: ${method} ${url}`);
  console.error(`User: ${userId}`);
  console.error(`Error Name: ${error.name}`);
  console.error(`Error Message: ${error.message}`);

  if (error.stack) {
    console.error(`Stack Trace:\n${error.stack}`);
  }

  if (error.details) {
    console.error(`Details: ${JSON.stringify(error.details, null, 2)}`);
  }

  if (error.originalError) {
    console.error(`Original Error: ${error.originalError.message}`);
  }

  console.error('===========================================\n');

  // TODO: 프로덕션 환경에서는 로그 수집 서비스로 전송
  // - Sentry, LogRocket, CloudWatch 등
  // - 민감한 정보(비밀번호, 토큰 등) 제거 후 전송
}

// =====================================================
// 중앙 에러 핸들러 미들웨어
// =====================================================

/**
 * 중앙 에러 처리 미들웨어
 *
 * @param {Error} err - 에러 객체
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
function errorHandler(err, req, res, next) {
  // 에러 로깅
  logError(err, req);

  // 이미 응답이 전송된 경우 기본 에러 핸들러로 전달
  if (res.headersSent) {
    return next(err);
  }

  // 환경 변수
  const isProduction = process.env.NODE_ENV === 'production';

  // 기본 에러 정보
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || '서버 내부 오류가 발생했습니다.';
  let details = null;

  // ===== 커스텀 에러 타입 처리 =====

  if (err instanceof ValidationError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    details = err.details;
  }
  else if (err instanceof AuthenticationError) {
    statusCode = 401;
    errorCode = 'AUTHENTICATION_ERROR';
  }
  else if (err instanceof AuthorizationError) {
    statusCode = 403;
    errorCode = 'AUTHORIZATION_ERROR';
  }
  else if (err instanceof NotFoundError) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
  }
  else if (err instanceof ConflictError) {
    statusCode = 409;
    errorCode = 'CONFLICT';
  }
  else if (err instanceof DatabaseError) {
    statusCode = 500;
    errorCode = 'DATABASE_ERROR';

    // 프로덕션에서는 상세한 DB 에러 메시지 숨김
    if (isProduction) {
      message = '데이터베이스 오류가 발생했습니다.';
    }
  }

  // ===== MySQL 에러 처리 =====

  else if (err.code && err.code.startsWith('ER_')) {
    statusCode = 500;
    errorCode = 'DATABASE_ERROR';

    // MySQL 에러 코드별 처리
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        statusCode = 409;
        errorCode = 'DUPLICATE_ENTRY';
        message = '중복된 데이터가 존재합니다.';
        break;

      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        statusCode = 400;
        errorCode = 'INVALID_REFERENCE';
        message = '참조된 데이터가 존재하지 않습니다.';
        break;

      case 'ER_ROW_IS_REFERENCED':
      case 'ER_ROW_IS_REFERENCED_2':
        statusCode = 400;
        errorCode = 'REFERENCED_DATA';
        message = '다른 데이터에서 참조 중인 데이터는 삭제할 수 없습니다.';
        break;

      default:
        if (isProduction) {
          message = '데이터베이스 오류가 발생했습니다.';
        }
    }
  }

  // ===== JWT 에러 처리 =====

  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = '유효하지 않은 토큰입니다.';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = '토큰이 만료되었습니다.';
  }

  // ===== Express 기본 에러 처리 =====

  else if (err.status) {
    // Express에서 설정한 status 사용
    statusCode = err.status;
  }

  // ===== 프로덕션 환경 처리 =====

  if (isProduction) {
    // 5xx 에러 메시지를 일반화
    if (statusCode >= 500) {
      message = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      details = null; // 상세 정보 제거
    }

    // 스택 트레이스 제거
    delete err.stack;
  } else {
    // 개발 환경에서는 스택 트레이스 포함
    details = details || {
      stack: err.stack,
      originalError: err.originalError?.message,
    };
  }

  // 표준 에러 응답 전송
  return sendError(res, errorCode, message, statusCode, details);
}

// =====================================================
// 404 Not Found 핸들러
// =====================================================

/**
 * 404 Not Found 에러 핸들러
 *
 * 정의되지 않은 라우트에 대한 요청 처리
 * errorHandler 미들웨어 이전에 등록해야 함
 *
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
function notFoundHandler(req, res, next) {
  const error = new NotFoundError(
    `요청한 경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`
  );
  next(error);
}

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  errorHandler,
  notFoundHandler,

  // 에러 클래스들 (컨트롤러/모델에서 사용)
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
};
