/**
 * =====================================================
 * Station Model
 * =====================================================
 *
 * 대여소 데이터베이스 작업을 처리하는 모델
 *
 * Table: stations
 * Columns:
 * - id: VARCHAR(10) PRIMARY KEY
 * - name: VARCHAR(200)
 * - address: VARCHAR(500)
 * - latitude: DECIMAL(10, 7)
 * - longitude: DECIMAL(10, 7)
 * - bike_count: INT UNSIGNED
 * - capacity: INT UNSIGNED
 * - status: ENUM('active', 'inactive')
 * - created_at: TIMESTAMP
 * - updated_at: TIMESTAMP
 */

const db = require('../config/database');

// =====================================================
// 조회 (Read)
// =====================================================

/**
 * ID로 대여소 조회
 *
 * @param {string} id - 대여소 ID
 * @returns {Promise<Object|null>} 대여소 객체 또는 null
 */
async function findById(id) {
  // TODO: ID로 대여소 조회
  const [rows] = await db.execute(
    'SELECT * FROM stations WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * 모든 대여소 조회 (필터링)
 *
 * @param {Object} options - 조회 옵션
 * @param {string} options.district - 구 이름 필터 (optional)
 * @param {string} options.status - 상태 필터 (optional)
 * @param {string} options.search - 검색어 (이름 또는 주소) (optional)
 * @returns {Promise<Array>} 대여소 배열
 */
async function findAll(options = {}) {
  // TODO: 필터 조건에 맞는 대여소 조회
  // let sql = 'SELECT * FROM stations WHERE 1=1';
  // const params = [];
  //
  // if (options.district) {
  //   sql += ' AND address LIKE ?';
  //   params.push(`%${options.district}%`);
  // }
  //
  // if (options.status) {
  //   sql += ' AND status = ?';
  //   params.push(options.status);
  // }
  //
  // if (options.search) {
  //   sql += ' AND (name LIKE ? OR address LIKE ?)';
  //   const searchPattern = `%${options.search}%`;
  //   params.push(searchPattern, searchPattern);
  // }
  //
  // sql += ' ORDER BY name ASC';
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
  // return rows;

  return [];
}

/**
 * 모든 대여소의 상태만 조회 (실시간 현황)
 *
 * @returns {Promise<Array>} { id, bike_count, status } 배열
 */
async function findAllStatus() {
  // TODO: 대여소 ID, 자전거 수, 상태만 조회
  // const [rows] = await db.execute(
  //   'SELECT id, bike_count, status FROM stations ORDER BY id ASC'
  // );
  // return rows;

  return [];
}

/**
 * 대여소 수 카운트
 *
 * @param {Object} filters - 필터 조건
 * @returns {Promise<number>} 대여소 수
 */
async function count(filters = {}) {
  // TODO: 조건에 맞는 대여소 수 카운트
  // let sql = 'SELECT COUNT(*) as count FROM stations WHERE 1=1';
  // const params = [];
  //
  // if (filters.status) {
  //   sql += ' AND status = ?';
  //   params.push(filters.status);
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
 * 새 대여소 생성
 *
 * @param {Object} stationData - 대여소 데이터
 * @returns {Promise<Object>} 생성된 대여소 객체
 */
async function create(stationData) {
  // TODO: 대여소 생성
  // const { id, name, address, latitude, longitude, bikeCount, capacity, status } = stationData;
  //
  // await db.execute(
  //   'INSERT INTO stations (id, name, address, latitude, longitude, bike_count, capacity, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  //   [id, name, address, latitude, longitude, bikeCount || 0, capacity, status || 'active']
  // );
  //
  // return await findById(id);

  return null;
}

// =====================================================
// 수정 (Update)
// =====================================================

/**
 * 대여소 정보 수정
 *
 * @param {string} id - 대여소 ID
 * @param {Object} updates - 업데이트할 필드
 * @returns {Promise<Object>} 업데이트된 대여소 객체
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
  // if (updates.address !== undefined) {
  //   fields.push('address = ?');
  //   values.push(updates.address);
  // }
  //
  // if (updates.capacity !== undefined) {
  //   fields.push('capacity = ?');
  //   values.push(updates.capacity);
  // }
  //
  // if (updates.status !== undefined) {
  //   fields.push('status = ?');
  //   values.push(updates.status);
  // }
  //
  // if (fields.length === 0) {
  //   return await findById(id);
  // }
  //
  // values.push(id);
  //
  // await db.execute(
  //   `UPDATE stations SET ${fields.join(', ')} WHERE id = ?`,
  //   values
  // );
  //
  // return await findById(id);

  return null;
}

/**
 * 대여소 자전거 수 증가
 *
 * @param {string} id - 대여소 ID
 * @returns {Promise<void>}
 */
async function incrementBikeCount(id) {
  // TODO: 자전거 수 +1
  // await db.execute(
  //   'UPDATE stations SET bike_count = bike_count + 1 WHERE id = ?',
  //   [id]
  // );
}

/**
 * 대여소 자전거 수 감소
 *
 * @param {string} id - 대여소 ID
 * @returns {Promise<void>}
 */
async function decrementBikeCount(id) {
  // TODO: 자전거 수 -1 (0보다 작아지지 않도록 체크)
  // await db.execute(
  //   'UPDATE stations SET bike_count = GREATEST(bike_count - 1, 0) WHERE id = ?',
  //   [id]
  // );
}

// =====================================================
// 삭제 (Delete)
// =====================================================

/**
 * 대여소 삭제
 *
 * @param {string} id - 대여소 ID
 * @returns {Promise<void>}
 */
async function deleteStation(id) {
  // TODO: 대여소 삭제
  // await db.execute('DELETE FROM stations WHERE id = ?', [id]);
}

// =====================================================
// Export
// =====================================================

module.exports = {
  findById,
  findAll,
  findAllStatus,
  count,
  create,
  update,
  incrementBikeCount,
  decrementBikeCount,
  deleteStation,
};
