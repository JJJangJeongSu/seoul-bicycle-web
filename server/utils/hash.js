/**
 * =====================================================
 * Password Hashing Utility Functions
 * =====================================================
 *
 * bcryptjs를 사용하여 비밀번호를 안전하게 해시하고 검증합니다.
 *
 * 주요 기능:
 * - 비밀번호 해시 생성 (bcrypt)
 * - 비밀번호 검증
 * - Salt 라운드 설정 가능
 *
 * 보안 특징:
 * - bcrypt는 Rainbow Table 공격에 강함
 * - Salt가 자동으로 생성되어 각 해시가 고유함
 * - 의도적으로 느린 알고리즘 (브루트 포스 공격 방어)
 *
 * 사용법:
 * const { hashPassword, verifyPassword } = require('./utils/hash');
 *
 * // 비밀번호 해시
 * const hash = await hashPassword('password123');
 *
 * // 비밀번호 검증
 * const isValid = await verifyPassword('password123', hash);
 */

const bcrypt = require('bcryptjs');

// =====================================================
// 환경 변수
// =====================================================

/**
 * Salt 라운드 수
 * - 값이 클수록 보안은 높아지지만 느려짐
 * - 권장값: 10-12
 * - 기본값: 10
 */
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;

// =====================================================
// 비밀번호 해시 생성
// =====================================================

/**
 * 비밀번호를 bcrypt로 해시합니다.
 *
 * @param {string} password - 해시할 평문 비밀번호
 * @returns {Promise<string>} 해시된 비밀번호
 * @throws {Error} 해시 생성 실패 시
 *
 * 예시:
 * const hash = await hashPassword('mySecurePassword123');
 * // => "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
 *
 * 주의:
 * - 해시된 비밀번호는 복호화할 수 없습니다 (단방향 암호화)
 * - 같은 비밀번호라도 매번 다른 해시가 생성됩니다 (Salt 때문)
 */
async function hashPassword(password) {
  try {
    // 입력 검증
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    // 비밀번호 길이 검증 (최소 8자)
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // bcrypt 해시 생성
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    return hash;
  } catch (error) {
    console.error('❌ Error hashing password:', error.message);
    throw new Error('Failed to hash password');
  }
}

// =====================================================
// 비밀번호 검증
// =====================================================

/**
 * 평문 비밀번호와 해시를 비교하여 일치 여부를 확인합니다.
 *
 * @param {string} password - 검증할 평문 비밀번호
 * @param {string} hash - 저장된 해시된 비밀번호
 * @returns {Promise<boolean>} 비밀번호 일치 여부
 *
 * 예시:
 * const isValid = await verifyPassword('myPassword123', storedHash);
 * if (isValid) {
 *   console.log('Login successful');
 * } else {
 *   console.log('Invalid password');
 * }
 *
 * 주의:
 * - 비밀번호가 틀려도 에러를 던지지 않고 false를 반환합니다
 * - 보안상 "비밀번호가 틀렸습니다"와 "사용자가 없습니다"를 구분하지 않습니다
 */
async function verifyPassword(password, hash) {
  try {
    // 입력 검증
    if (!password || typeof password !== 'string') {
      return false;
    }

    if (!hash || typeof hash !== 'string') {
      return false;
    }

    // bcrypt 검증
    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
  } catch (error) {
    console.error('❌ Error verifying password:', error.message);
    return false; // 에러 발생 시 false 반환 (보안상 이유)
  }
}

// =====================================================
// 해시 강도 확인
// =====================================================

/**
 * 해시된 비밀번호의 Salt 라운드를 확인합니다.
 *
 * @param {string} hash - 확인할 해시
 * @returns {number|null} Salt 라운드 수 또는 null
 *
 * 예시:
 * const rounds = getHashRounds(hash);
 * console.log(`This hash uses ${rounds} salt rounds`);
 *
 * bcrypt 해시 형식:
 * $2a$10$N9qo8uLOickgx2ZMRZoMye...
 *  │  │  └── Salt (22자) + Hash (31자)
 *  │  └──── Salt 라운드 (10)
 *  └────── 알고리즘 버전 (2a)
 */
function getHashRounds(hash) {
  try {
    if (!hash || typeof hash !== 'string') {
      return null;
    }

    // bcrypt 해시 형식: $2a$10$...
    const match = hash.match(/^\$2[aby]?\$(\d+)\$/);

    if (!match) {
      return null;
    }

    return parseInt(match[1], 10);
  } catch (error) {
    console.error('Error getting hash rounds:', error.message);
    return null;
  }
}

// =====================================================
// 해시 강도 업그레이드 필요 여부 확인
// =====================================================

/**
 * 기존 해시가 현재 설정된 Salt 라운드보다 낮은지 확인합니다.
 *
 * @param {string} hash - 확인할 해시
 * @returns {boolean} 재해싱이 필요한지 여부
 *
 * 예시:
 * if (needsRehash(user.passwordHash)) {
 *   // 사용자가 다음 로그인 시 비밀번호를 재해싱
 *   const newHash = await hashPassword(password);
 *   await updateUserPassword(user.id, newHash);
 * }
 *
 * 사용 시나리오:
 * - 보안 정책이 강화되어 Salt 라운드를 증가시킨 경우
 * - 기존 사용자의 해시를 점진적으로 업그레이드
 */
function needsRehash(hash) {
  const currentRounds = getHashRounds(hash);

  if (currentRounds === null) {
    return true; // 유효하지 않은 해시
  }

  return currentRounds < SALT_ROUNDS;
}

// =====================================================
// 랜덤 토큰 생성 (이메일 인증, 비밀번호 재설정 등)
// =====================================================

/**
 * 암호학적으로 안전한 랜덤 토큰을 생성합니다.
 *
 * @param {number} length - 토큰 길이 (바이트)
 * @returns {Promise<string>} 16진수 토큰 문자열
 *
 * 예시:
 * const resetToken = await generateSecureToken(32);
 * // => "a3f5c8d9e7b2..."  (64자리 16진수)
 *
 * 사용 시나리오:
 * - 이메일 인증 토큰
 * - 비밀번호 재설정 토큰
 * - API 키 생성
 */
async function generateSecureToken(length = 32) {
  try {
    // Node.js crypto 모듈 사용
    const crypto = require('crypto');

    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString('hex'));
        }
      });
    });
  } catch (error) {
    console.error('Error generating secure token:', error.message);
    throw new Error('Failed to generate secure token');
  }
}

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  // 비밀번호 해싱
  hashPassword,
  verifyPassword,

  // 해시 정보
  getHashRounds,
  needsRehash,

  // 보안 토큰
  generateSecureToken,

  // 상수
  SALT_ROUNDS,
};
