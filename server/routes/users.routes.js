/**
 * =====================================================
 * Users Routes
 * =====================================================
 *
 * 사용자 프로필 관리 관련 라우트
 *
 * Base Path: /api/users
 *
 * Endpoints:
 * - GET    /me          - 내 프로필 조회
 * - PUT    /me          - 내 프로필 수정
 * - PUT    /me/password - 비밀번호 변경
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const usersController = require('../controllers/users.controller');

// 미들웨어 import
const { authenticate } = require('../middleware/auth');
const {
  validateUpdateProfile,
  validateChangePassword,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   GET /api/users/me
 * @desc    내 프로필 조회
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "user": {
 *       "id": "user_id",
 *       "email": "user@example.com",
 *       "name": "홍길동",
 *       "phone": "010-1234-5678",
 *       "role": "user",
 *       "status": "active",
 *       "createdAt": "2024-01-01T00:00:00Z"
 *     }
 *   }
 * }
 */
router.get('/me', authenticate, usersController.getMe);

/**
 * @route   PUT /api/users/me
 * @desc    내 프로필 수정
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Request Body:
 * {
 *   "name": "홍길동",
 *   "phone": "010-1234-5678"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "user": {
 *       "id": "user_id",
 *       "email": "user@example.com",
 *       "name": "홍길동",
 *       "phone": "010-1234-5678",
 *       "role": "user",
 *       "status": "active"
 *     }
 *   }
 * }
 */
router.put('/me', authenticate, validateUpdateProfile, usersController.updateMe);

/**
 * @route   PUT /api/users/me/password
 * @desc    비밀번호 변경
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Request Body:
 * {
 *   "currentPassword": "old_password",
 *   "newPassword": "new_password"
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "message": "비밀번호가 변경되었습니다."
 *   }
 * }
 */
router.put(
  '/me/password',
  authenticate,
  validateChangePassword,
  usersController.changePassword
);

// =====================================================
// Export
// =====================================================

module.exports = router;
