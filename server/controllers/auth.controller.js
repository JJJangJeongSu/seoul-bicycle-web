/**
 * =====================================================
 * Authentication Controller
 * =====================================================
 *
 * 사용자 인증 관련 비즈니스 로직 처리
 *
 * Functions:
 * - login        - 로그인
 * - signup       - 회원가입
 * - checkEmail   - 이메일 중복 확인
 */

const { sendSuccess, sendError } = require('../utils/response');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const UserModel = require('../models/User.model');

// =====================================================
// 로그인
// =====================================================

/**
 * 사용자 로그인
 *
 * @route   POST /api/auth/login
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.email - 이메일
 * @param {string} req.body.password - 비밀번호
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // TODO: 1. 이메일로 사용자 조회
    // const user = await UserModel.findByEmail(email);
    // if (!user) {
    //   return sendError(res, 'AUTH_INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    // }

    // TODO: 2. 계정 상태 확인
    // if (user.status === 'blocked') {
    //   return sendError(res, 'AUTH_ACCOUNT_BLOCKED', '차단된 계정입니다.', 403);
    // }

    // TODO: 3. 비밀번호 검증
    // const isPasswordValid = await comparePassword(password, user.passwordHash);
    // if (!isPasswordValid) {
    //   return sendError(res, 'AUTH_INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.', 401);
    // }

    // TODO: 4. JWT 토큰 생성
    // const token = generateToken({
    //   id: user.id,
    //   email: user.email,
    //   role: user.role,
    // });

    // TODO: 5. 응답 데이터 구성 (비밀번호 해시 제외)
    // const userData = {
    //   id: user.id,
    //   email: user.email,
    //   name: user.name,
    //   phone: user.phone,
    //   role: user.role,
    // };

    // Placeholder response
    return sendSuccess(
      res,
      {
        user: {
          id: '1',
          email,
          name: '테스트 사용자',
          phone: '010-0000-0000',
          role: email === 'admin@test.com' ? 'admin' : 'user',
        },
        token: 'placeholder_jwt_token',
      },
      200
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 회원가입
// =====================================================

/**
 * 회원가입
 *
 * @route   POST /api/auth/signup
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.email - 이메일
 * @param {string} req.body.password - 비밀번호
 * @param {string} req.body.name - 이름
 * @param {string} req.body.phone - 전화번호
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function signup(req, res, next) {
  try {
    const { email, password, name, phone } = req.body;

    // TODO: 1. 이메일 중복 확인
    // const existingUser = await UserModel.findByEmail(email);
    // if (existingUser) {
    //   return sendError(res, 'AUTH_EMAIL_EXISTS', '이미 사용 중인 이메일입니다.', 409);
    // }

    // TODO: 2. 비밀번호 해싱
    // const passwordHash = await hashPassword(password);

    // TODO: 3. 사용자 ID 생성 (UUID 또는 auto-increment)
    // const userId = generateUserId(); // 예: crypto.randomUUID()

    // TODO: 4. 사용자 데이터 저장
    // const newUser = await UserModel.create({
    //   id: userId,
    //   email,
    //   passwordHash,
    //   name,
    //   phone,
    //   role: 'user', // 기본값: 일반 사용자
    //   status: 'active',
    // });

    // TODO: 5. JWT 토큰 생성
    // const token = generateToken({
    //   id: newUser.id,
    //   email: newUser.email,
    //   role: newUser.role,
    // });

    // TODO: 6. 응답 데이터 구성
    // const userData = {
    //   id: newUser.id,
    //   email: newUser.email,
    //   name: newUser.name,
    //   phone: newUser.phone,
    //   role: newUser.role,
    // };

    // Placeholder response
    return sendSuccess(
      res,
      {
        user: {
          id: 'new_user_id',
          email,
          name,
          phone,
          role: 'user',
        },
        token: 'placeholder_jwt_token',
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 이메일 중복 확인
// =====================================================

/**
 * 이메일 중복 확인
 *
 * @route   GET /api/auth/check-email
 * @access  Public
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {string} req.query.email - 확인할 이메일
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function checkEmail(req, res, next) {
  try {
    const { email } = req.query;

    // TODO: 1. 이메일로 사용자 조회
    // const user = await UserModel.findByEmail(email);

    // TODO: 2. 사용 가능 여부 반환
    // const available = !user;

    // Placeholder response
    return sendSuccess(res, {
      available: true, // TODO: 실제 중복 확인 결과로 대체
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// Export
// =====================================================

module.exports = {
  login,
  signup,
  checkEmail,
};
