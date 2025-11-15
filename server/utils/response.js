/**
 * =====================================================
 * API Response Formatter Utility
 * =====================================================
 *
 * OpenAPI 스펙에 정의된 표준 응답 형식을 생성합니다.
 *
 * 표준 응답 형식:
 * {
 *   status: 'success' | 'error',
 *   data: { ... },           // 성공 시
 *   error: { ... },          // 실패 시
 *   metadata: {
 *     timestamp: '2024-11-15T10:30:00Z',
 *     version: 'v1.0',
 *     requestId: 'req_...'
 *   },
 *   pagination: { ... }      // 목록 조회 시 (선택)
 * }
 */

const crypto = require('crypto');

// =====================================================
// 메타데이터 생성
// =====================================================

/**
 * 응답 메타데이터 생성
 * @param {Object} options - 메타데이터 옵션
 * @returns {Object} 메타데이터 객체
 */
function createMetadata(options = {}) {
  return {
    timestamp: new Date().toISOString(),
    version: options.version || 'v1.0',
    api: options.api || null,
    operation: options.operation || null,
    requestId: options.requestId || `req_${crypto.randomBytes(8).toString('hex')}`,
    processingTime: options.processingTime || null,
  };
}

// =====================================================
// 성공 응답
// =====================================================

/**
 * 표준 성공 응답 생성
 * @param {Object} data - 응답 데이터
 * @param {Object} options - 추가 옵션 (metadata, pagination)
 * @returns {Object} 표준 응답 객체
 */
function successResponse(data, options = {}) {
  const response = {
    status: 'success',
    data,
    metadata: createMetadata(options.metadata),
  };

  // 페이지네이션 정보 추가 (선택적)
  if (options.pagination) {
    response.pagination = {
      currentPage: options.pagination.currentPage || 1,
      totalPages: options.pagination.totalPages || 1,
      totalItems: options.pagination.totalItems || 0,
      itemsPerPage: options.pagination.itemsPerPage || 20,
      hasNext: options.pagination.hasNext || false,
      hasPrev: options.pagination.hasPrev || false,
    };
  }

  return response;
}

// =====================================================
// 에러 응답
// =====================================================

/**
 * 표준 에러 응답 생성
 * @param {string} code - 에러 코드
 * @param {string} message - 에러 메시지
 * @param {Object} details - 추가 에러 정보 (선택)
 * @param {Object} options - 추가 옵션 (metadata)
 * @returns {Object} 표준 에러 응답 객체
 */
function errorResponse(code, message, details = null, options = {}) {
  const response = {
    status: 'error',
    error: {
      code,
      message,
    },
    metadata: createMetadata(options.metadata),
  };

  if (details) {
    response.error.details = details;
  }

  return response;
}

// =====================================================
// 페이지네이션 계산
// =====================================================

/**
 * 페이지네이션 정보 계산
 * @param {number} totalItems - 전체 항목 수
 * @param {number} currentPage - 현재 페이지
 * @param {number} itemsPerPage - 페이지당 항목 수
 * @returns {Object} 페이지네이션 정보
 */
function calculatePagination(totalItems, currentPage = 1, itemsPerPage = 20) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    currentPage: parseInt(currentPage, 10),
    totalPages,
    totalItems,
    itemsPerPage: parseInt(itemsPerPage, 10),
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// =====================================================
// Express Response 헬퍼
// =====================================================

/**
 * Express 응답 헬퍼 - 성공
 */
function sendSuccess(res, data, statusCode = 200, options = {}) {
  return res.status(statusCode).json(successResponse(data, options));
}

/**
 * Express 응답 헬퍼 - 에러
 */
function sendError(res, code, message, statusCode = 400, details = null, options = {}) {
  return res.status(statusCode).json(errorResponse(code, message, details, options));
}

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  successResponse,
  errorResponse,
  createMetadata,
  calculatePagination,
  sendSuccess,
  sendError,
};
