/**
 * =====================================================
 * User Model
 * =====================================================
 *
 * 사용자 데이터베이스 작업을 처리하는 모델
 *
 * Table: users
 * Columns:
 * - id: VARCHAR(50) PRIMARY KEY
 * - email: VARCHAR(255) UNIQUE
 * - password_hash: VARCHAR(255)
 * - name: VARCHAR(100)
 * - phone: VARCHAR(20)
 * - role: ENUM('user', 'admin')
 * - status: ENUM('active', 'blocked')
 * - created_at: TIMESTAMP
 * - updated_at: TIMESTAMP
 */

const db = require('../config/database');

// =====================================================
// 조회 (Read)
// =====================================================

/**
 * ID로 사용자 조회
 *
 * @param {string} id - 사용자 ID
 * @returns {Promise<Object|null>} 사용자 객체 또는 null
 */
async function findById(id) {
  // TODO: ID로 사용자 조회
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * 이메일로 사용자 조회
 *
 * @param {string} email - 이메일 주소
 * @returns {Promise<Object|null>} 사용자 객체 또는 null
 */
async function findByEmail(email) {
  // TODO: 이메일로 사용자 조회
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

/**
 * 모든 사용자 조회 (필터링, 페이지네이션)
 *
 * @param {Object} options - 조회 옵션
 * @param {string} options.role - 역할 필터 (optional)
 * @param {string} options.status - 상태 필터 (optional)
 * @param {string} options.search - 검색어 (이름 또는 이메일) (optional)
 * @param {number} options.limit - 제한 개수 (optional)
 * @param {number} options.offset - 오프셋 (optional)
 * @returns {Promise<Object>} { users: Array, totalCount: number }
 */
async function findAll(options = {}) {
  // TODO: 필터 조건 및 쿼리 구성
  // let sql = 'SELECT * FROM users WHERE 1=1';
  // const params = [];
  //
  // if (options.role) {
  //   sql += ' AND role = ?';
  //   params.push(options.role);
  // }
  //
  // if (options.status) {
  //   sql += ' AND status = ?';
  //   params.push(options.status);
  // }
  //
  // if (options.search) {
  //   sql += ' AND (name LIKE ? OR email LIKE ?)';
  //   const searchPattern = `%${options.search}%`;
  //   params.push(searchPattern, searchPattern);
  // }
  //
  // // 전체 개수 조회
  // const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
  // const [countRows] = await db.execute(countSql, params);
  // const totalCount = countRows[0].count;
  //
  // // 정렬 및 페이지네이션
  // sql += ' ORDER BY created_at DESC';
  //
  // if (options.limit) {
  //   sql += ' LIMIT ?';
  //   params.push(options.limit);
  // }
  //
  // if (options.offset) {
  //   sql += ' OFFSET ?';
  //   params.push(options.offset);
  // }
  //
  // const [rows] = await db.execute(sql, params);
  //
  // return {
  //   users: rows,
  //   totalCount,
  // };

  return {
    users: [],
    totalCount: 0,
  };
}

/**
 * 사용자 수 카운트
 *
 * @param {Object} filters - 필터 조건
 * @returns {Promise<number>} 사용자 수
 */
async function count(filters = {}) {
  // TODO: 조건에 맞는 사용자 수 카운트
  // let sql = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
  // const params = [];
  //
  // if (filters.status) {
  //   sql += ' AND status = ?';
  //   params.push(filters.status);
  // }
  //
  // if (filters.role) {
  //   sql += ' AND role = ?';
  //   params.push(filters.role);
  // }
  //
  // const [rows] = await db.execute(sql, params);
  // return rows[0].count;

  return 0;
}

// =====================================================
// 생성 (Create)
// =====================================================

/**
 * 새 사용자 생성
 *
 * @param {Object} userData - 사용자 데이터
 * @param {string} userData.id - 사용자 ID
 * @param {string} userData.email - 이메일
 * @param {string} userData.passwordHash - 비밀번호 해시
 * @param {string} userData.name - 이름
 * @param {string} userData.phone - 전화번호
 * @param {string} userData.role - 역할 (user | admin)
 * @param {string} userData.status - 상태 (active | blocked)
 * @returns {Promise<Object>} 생성된 사용자 객체
 */
async function create(userData) {
  // TODO: 사용자 생성
  // const { id, email, passwordHash, name, phone, role, status } = userData;
  //
  // await db.execute(
  //   'INSERT INTO users (id, email, password_hash, name, phone, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
  //   [id, email, passwordHash, name, phone, role || 'user', status || 'active']
  // );
  //
  // return await findById(id);

  return null;
}

// =====================================================
// 수정 (Update)
// =====================================================

/**
 * 사용자 정보 수정
 *
 * @param {string} id - 사용자 ID
 * @param {Object} updates - 업데이트할 필드
 * @returns {Promise<Object>} 업데이트된 사용자 객체
 */
async function update(id, updates) {
  // TODO: 동적으로 업데이트 쿼리 구성
  // const fields = [];
  // const values = [];
  //
  // if (updates.name !== undefined) {
  //   fields.push('name = ?');
  //   values.push(updates.name);
  // }
  //
  // if (updates.phone !== undefined) {
  //   fields.push('phone = ?');
  //   values.push(updates.phone);
  // }
  //
  // if (fields.length === 0) {
  //   return await findById(id);
  // }
  //
  // values.push(id);
  //
  // await db.execute(
  //   `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
  //   values
  // );
  //
  // return await findById(id);

  return null;
}

/**
 * 사용자 상태 변경
 *
 * @param {string} id - 사용자 ID
 * @param {string} status - 상태 (active | blocked)
 * @returns {Promise<void>}
 */
async function updateStatus(id, status) {
  // TODO: 사용자 상태 업데이트
  // await db.execute(
  //   'UPDATE users SET status = ? WHERE id = ?',
  //   [status, id]
  // );
}

/**
 * 비밀번호 변경
 *
 * @param {string} id - 사용자 ID
 * @param {string} passwordHash - 새 비밀번호 해시
 * @returns {Promise<void>}
 */
async function updatePassword(id, passwordHash) {
  // TODO: 비밀번호 해시 업데이트
  // await db.execute(
  //   'UPDATE users SET password_hash = ? WHERE id = ?',
  //   [passwordHash, id]
  // );
}

// =====================================================
// 삭제 (Delete)
// =====================================================

/**
 * 사용자 삭제
 *
 * @param {string} id - 사용자 ID
 * @returns {Promise<void>}
 */
async function deleteUser(id) {
  // TODO: 사용자 삭제 (CASCADE로 관련 데이터도 삭제됨)
  // await db.execute('DELETE FROM users WHERE id = ?', [id]);
}

// =====================================================
// Export
// =====================================================

module.exports = {
  findById,
  findByEmail,
  findAll,
  count,
  create,
  update,
  updateStatus,
  updatePassword,
  deleteUser,
};
