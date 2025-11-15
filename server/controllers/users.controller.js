/**
 * =====================================================
 * Users Controller
 * =====================================================
 *
 * 사용자 프로필 관리 관련 비즈니스 로직 처리
 *
 * Functions:
 * - getMe          - 내 프로필 조회
 * - updateMe       - 내 프로필 수정
 * - changePassword - 비밀번호 변경
 */

const { sendSuccess, sendError } = require('../utils/response');
const { hashPassword, comparePassword } = require('../utils/hash');
const UserModel = require('../models/User.model');

// =====================================================
// 내 프로필 조회
// =====================================================

/**
 * 내 프로필 조회
 *
 * @route   GET /api/users/me
 * @access  Private
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    // TODO: 1. 사용자 정보 조회
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //   return sendError(res, 'USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 비밀번호 해시 제거
    // const { passwordHash, ...userData } = user;

    // Placeholder response
    return sendSuccess(res, {
      user: {
        id: userId,
        email: req.user.email,
        name: '홍길동',
        phone: '010-1234-5678',
        role: req.user.role,
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 내 프로필 수정
// =====================================================

/**
 * 내 프로필 수정
 *
 * @route   PUT /api/users/me
 * @access  Private
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.name - 이름 (optional)
 * @param {string} req.body.phone - 전화번호 (optional)
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function updateMe(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // TODO: 1. 업데이트할 필드 구성
    // const updates = {};
    // if (name) updates.name = name;
    // if (phone) updates.phone = phone;

    // TODO: 2. 사용자 정보 업데이트
    // const updatedUser = await UserModel.update(userId, updates);

    // TODO: 3. 비밀번호 해시 제거
    // const { passwordHash, ...userData } = updatedUser;

    // Placeholder response
    return sendSuccess(res, {
      user: {
        id: userId,
        email: req.user.email,
        name: name || '홍길동',
        phone: phone || '010-1234-5678',
        role: req.user.role,
        status: 'active',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 비밀번호 변경
// =====================================================

/**
 * 비밀번호 변경
 *
 * @route   PUT /api/users/me/password
 * @access  Private
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.currentPassword - 현재 비밀번호
 * @param {string} req.body.newPassword - 새 비밀번호
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // TODO: 1. 사용자 조회 (비밀번호 해시 포함)
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //   return sendError(res, 'USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 현재 비밀번호 검증
    // const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    // if (!isCurrentPasswordValid) {
    //   return sendError(res, 'INVALID_PASSWORD', '현재 비밀번호가 올바르지 않습니다.', 401);
    // }

    // TODO: 3. 새 비밀번호가 현재 비밀번호와 동일한지 확인
    // const isSamePassword = await comparePassword(newPassword, user.passwordHash);
    // if (isSamePassword) {
    //   return sendError(res, 'SAME_PASSWORD', '새 비밀번호는 현재 비밀번호와 달라야 합니다.', 400);
    // }

    // TODO: 4. 새 비밀번호 해싱
    // const newPasswordHash = await hashPassword(newPassword);

    // TODO: 5. 비밀번호 업데이트
    // await UserModel.updatePassword(userId, newPasswordHash);

    // Placeholder response
    return sendSuccess(res, {
      message: '비밀번호가 변경되었습니다.',
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// Export
// =====================================================

module.exports = {
  getMe,
  updateMe,
  changePassword,
};
