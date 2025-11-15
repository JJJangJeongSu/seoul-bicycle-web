/**
 * =====================================================
 * Authentication Routes
 * =====================================================
 *
 * 사용자 인증 관련 라우트
 *
 * Base Path: /api/auth
 *
 * Endpoints:
 * - POST   /login        - 로그인
 * - POST   /signup       - 회원가입
 * - GET    /check-email  - 이메일 중복 확인
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const authController = require('../controllers/auth.controller');

// 검증 미들웨어 import
const {
  validateLogin,
  validateSignup,
  validateCheckEmail,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   POST /api/auth/login
 * @desc    사용자 로그인
 * @access  Public
 *
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "user": { id, email, name, phone, role },
 *     "token": "jwt_token_here"
 *   }
 * }
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/signup
 * @desc    회원가입
 * @access  Public
 *
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "name": "홍길동",
 *   "phone": "010-1234-5678"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "user": { id, email, name, phone, role },
 *     "token": "jwt_token_here"
 *   }
 * }
 */
router.post('/signup', validateSignup, authController.signup);

/**
 * @route   GET /api/auth/check-email?email=user@example.com
 * @desc    이메일 중복 확인
 * @access  Public
 *
 * Query Params:
 * - email: string (required)
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "available": true | false
 *   }
 * }
 */
router.get('/check-email', validateCheckEmail, authController.checkEmail);

// =====================================================
// Export
// =====================================================

module.exports = router;
