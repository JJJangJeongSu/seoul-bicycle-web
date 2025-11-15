/**
 * =====================================================
 * JWT (JSON Web Token) Utility Functions
 * =====================================================
 *
 * JWT 토큰 생성, 검증, 디코딩 등의 기능을 제공합니다.
 *
 * 주요 기능:
 * - Access Token 생성 (짧은 유효기간)
 * - Refresh Token 생성 (긴 유효기간)
 * - 토큰 검증 및 디코딩
 * - 토큰에서 사용자 정보 추출
 *
 * 사용법:
 * const { generateAccessToken } = require('./utils/jwt');
 * const token = generateAccessToken({ id: '1', email: 'user@test.com', role: 'user' });
 */

const jwt = require('jsonwebtoken');

// =====================================================
// 환경 변수
// =====================================================

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// =====================================================
// Access Token 생성
// =====================================================

/**
 * Access Token 생성
 *
 * @param {Object} payload - 토큰에 포함할 사용자 정보
 * @param {string} payload.id - 사용자 ID
 * @param {string} payload.email - 사용자 이메일
 * @param {string} payload.role - 사용자 역할 ('user' | 'admin')
 * @returns {string} JWT Access Token
 *
 * 예시:
 * const token = generateAccessToken({ id: '1', email: 'user@test.com', role: 'user' });
 */
function generateAccessToken(payload) {
  // 민감한 정보는 제외하고 필요한 정보만 포함
  const tokenPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    type: 'access', // 토큰 타입 식별
  };

  // 토큰 생성
  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'seoul-bike-api',           // 토큰 발행자
    audience: 'seoul-bike-client',      // 토큰 대상
  });

  return token;
}

// =====================================================
// Refresh Token 생성
// =====================================================

/**
 * Refresh Token 생성
 *
 * @param {Object} payload - 토큰에 포함할 사용자 정보
 * @param {string} payload.id - 사용자 ID
 * @returns {string} JWT Refresh Token
 *
 * Refresh Token은 사용자 ID만 포함하고 긴 유효기간을 가집니다.
 * Access Token 재발급에만 사용됩니다.
 */
function generateRefreshToken(payload) {
  const tokenPayload = {
    id: payload.id,
    type: 'refresh',
  };

  const token = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'seoul-bike-api',
    audience: 'seoul-bike-client',
  });

  return token;
}

// =====================================================
// 토큰 검증
// =====================================================

/**
 * Access Token 검증
 *
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} 디코딩된 페이로드
 * @throws {Error} 토큰이 유효하지 않은 경우
 *
 * 예시:
 * try {
 *   const decoded = verifyAccessToken(token);
 *   console.log(decoded.id, decoded.email, decoded.role);
 * } catch (error) {
 *   console.error('Invalid token:', error.message);
 * }
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'seoul-bike-api',
      audience: 'seoul-bike-client',
    });

    // 토큰 타입 확인
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    // JWT 에러 메시지를 더 명확하게 변환
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet');
    } else {
      throw error;
    }
  }
}

/**
 * Refresh Token 검증
 *
 * @param {string} token - 검증할 Refresh Token
 * @returns {Object} 디코딩된 페이로드
 * @throws {Error} 토큰이 유효하지 않은 경우
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'seoul-bike-api',
      audience: 'seoul-bike-client',
    });

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      throw error;
    }
  }
}

// =====================================================
// 토큰 디코딩 (검증 없이)
// =====================================================

/**
 * 토큰 디코딩 (서명 검증 없이)
 *
 * @param {string} token - 디코딩할 JWT 토큰
 * @returns {Object|null} 디코딩된 페이로드 또는 null
 *
 * 주의: 이 함수는 서명을 검증하지 않습니다.
 * 디버깅이나 토큰 내용 확인 용도로만 사용하세요.
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
}

// =====================================================
// Authorization 헤더에서 토큰 추출
// =====================================================

/**
 * Authorization 헤더에서 Bearer 토큰 추출
 *
 * @param {string} authHeader - Authorization 헤더 값
 * @returns {string|null} 추출된 토큰 또는 null
 *
 * 예시:
 * const token = extractTokenFromHeader(req.headers.authorization);
 * // "Bearer eyJhbGci..." => "eyJhbGci..."
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader) {
    return null;
  }

  // "Bearer <token>" 형식 확인
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

// =====================================================
// 토큰 만료 시간 확인
// =====================================================

/**
 * 토큰 만료 시간 확인
 *
 * @param {string} token - 확인할 JWT 토큰
 * @returns {Object} 만료 정보
 * @returns {boolean} expired - 만료 여부
 * @returns {number} expiresAt - 만료 시간 (Unix timestamp)
 * @returns {number} remainingSeconds - 남은 시간 (초)
 */
function getTokenExpiration(token) {
  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return {
        expired: true,
        expiresAt: null,
        remainingSeconds: 0,
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = decoded.exp;
    const remainingSeconds = expiresAt - now;

    return {
      expired: remainingSeconds <= 0,
      expiresAt,
      remainingSeconds: Math.max(0, remainingSeconds),
    };
  } catch (error) {
    return {
      expired: true,
      expiresAt: null,
      remainingSeconds: 0,
    };
  }
}

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  // 토큰 생성
  generateAccessToken,
  generateRefreshToken,

  // 토큰 검증
  verifyAccessToken,
  verifyRefreshToken,

  // 유틸리티
  decodeToken,
  extractTokenFromHeader,
  getTokenExpiration,
};
