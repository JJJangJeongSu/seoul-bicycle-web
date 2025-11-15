/**
 * =====================================================
 * Bike Model
 * =====================================================
 *
 * 자전거 데이터베이스 작업을 처리하는 모델
 *
 * Table: bikes
 * Columns:
 * - id: VARCHAR(15) PRIMARY KEY
 * - current_station_id: VARCHAR(10) (nullable)
 * - status: ENUM('available', 'rented', 'maintenance', 'broken')
 * - model: VARCHAR(100) (nullable)
 * - created_at: TIMESTAMP
 * - updated_at: TIMESTAMP
 */

const db = require('../config/database');

// =====================================================
// 조회 (Read)
// =====================================================

/**
 * ID로 자전거 조회
 *
 * @param {string} id - 자전거 ID
 * @returns {Promise<Object|null>} 자전거 객체 또는 null
 */
async function findById(id) {
  // TODO: ID로 자전거 조회
  const [rows] = await db.execute(
    'SELECT * FROM bikes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * 모든 자전거 조회 (필터링, 페이지네이션)
 *
 * @param {Object} options - 조회 옵션
 * @param {string} options.status - 상태 필터 (optional)
 * @param {string} options.currentStationId - 대여소 ID 필터 (optional)
 * @param {number} options.limit - 제한 개수 (optional)
 * @param {number} options.offset - 오프셋 (optional)
 * @returns {Promise<Object>} { bikes: Array, totalCount: number }
 */
async function findAll(options = {}) {
  // TODO: 필터 조건에 맞는 자전거 조회
  // let sql = 'SELECT * FROM bikes WHERE 1=1';
  // const params = [];
  //
  // if (options.status) {
  //   sql += ' AND status = ?';
  //   params.push(options.status);
  // }
  //
  // if (options.currentStationId) {
  //   sql += ' AND current_station_id = ?';
  //   params.push(options.currentStationId);
  // }
  //
  // // 전체 개수 조회
  // const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
  // const [countRows] = await db.execute(countSql, params);
  // const totalCount = countRows[0].count;
  //
  // // 정렬 및 페이지네이션
  // sql += ' ORDER BY id ASC';
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
  //   bikes: rows,
  //   totalCount,
  // };

  return {
    bikes: [],
    totalCount: 0,
  };
}

/**
 * 특정 대여소에서 대여 가능한 자전거 찾기
 *
 * @param {string} stationId - 대여소 ID
 * @returns {Promise<Object|null>} 자전거 객체 또는 null
 */
async function findAvailableAtStation(stationId) {
  // TODO: 대여소에 있는 대여 가능한 자전거 중 하나 조회
  // const [rows] = await db.execute(
  //   'SELECT * FROM bikes WHERE current_station_id = ? AND status = ? LIMIT 1',
  //   [stationId, 'available']
  // );
  // return rows[0] || null;

  return null;
}

/**
 * 자전거 수 카운트
 *
 * @param {Object} filters - 필터 조건
 * @returns {Promise<number>} 자전거 수
 */
async function count(filters = {}) {
  // TODO: 조건에 맞는 자전거 수 카운트
  // let sql = 'SELECT COUNT(*) as count FROM bikes WHERE 1=1';
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
 * 새 자전거 생성
 *
 * @param {Object} bikeData - 자전거 데이터
 * @returns {Promise<Object>} 생성된 자전거 객체
 */
async function create(bikeData) {
  // TODO: 자전거 생성
  // const { id, currentStationId, status, model } = bikeData;
  //
  // await db.execute(
  //   'INSERT INTO bikes (id, current_station_id, status, model) VALUES (?, ?, ?, ?)',
  //   [id, currentStationId || null, status || 'available', model || null]
  // );
  //
  // return await findById(id);

  return null;
}

// =====================================================
// 수정 (Update)
// =====================================================

/**
 * 자전거 정보 수정
 *
 * @param {string} id - 자전거 ID
 * @param {Object} updates - 업데이트할 필드
 * @returns {Promise<Object>} 업데이트된 자전거 객체
 */
async function update(id, updates) {
  // TODO: 동적으로 업데이트 쿼리 구성
  // const fields = [];
  // const values = [];
  //
  // if (updates.currentStationId !== undefined) {
  //   fields.push('current_station_id = ?');
  //   values.push(updates.currentStationId);
  // }
  //
  // if (updates.status !== undefined) {
  //   fields.push('status = ?');
  //   values.push(updates.status);
  // }
  //
  // if (updates.model !== undefined) {
  //   fields.push('model = ?');
  //   values.push(updates.model);
  // }
  //
  // if (fields.length === 0) {
  //   return await findById(id);
  // }
  //
  // values.push(id);
  //
  // await db.execute(
  //   `UPDATE bikes SET ${fields.join(', ')} WHERE id = ?`,
  //   values
  // );
  //
  // return await findById(id);

  return null;
}

/**
 * 자전거 상태 변경
 *
 * @param {string} id - 자전거 ID
 * @param {string} status - 상태 (available | rented | maintenance | broken)
 * @returns {Promise<void>}
 */
async function updateStatus(id, status) {
  // TODO: 자전거 상태 업데이트
  // await db.execute(
  //   'UPDATE bikes SET status = ? WHERE id = ?',
  //   [status, id]
  // );
}

/**
 * 자전거 대여 처리 (상태 변경 + 대여소 제거)
 *
 * @param {string} id - 자전거 ID
 * @returns {Promise<void>}
 */
async function markAsRented(id) {
  // TODO: 자전거를 대여 중 상태로 변경
  // await db.execute(
  //   'UPDATE bikes SET status = ?, current_station_id = NULL WHERE id = ?',
  //   ['rented', id]
  // );
}

/**
 * 자전거 반납 처리 (상태 변경 + 대여소 설정)
 *
 * @param {string} id - 자전거 ID
 * @param {string} stationId - 반납 대여소 ID
 * @returns {Promise<void>}
 */
async function markAsReturned(id, stationId) {
  // TODO: 자전거를 반납 완료 상태로 변경
  // await db.execute(
  //   'UPDATE bikes SET status = ?, current_station_id = ? WHERE id = ?',
  //   ['available', stationId, id]
  // );
}

// =====================================================
// 삭제 (Delete)
// =====================================================

/**
 * 자전거 삭제
 *
 * @param {string} id - 자전거 ID
 * @returns {Promise<void>}
 */
async function deleteBike(id) {
  // TODO: 자전거 삭제
  // await db.execute('DELETE FROM bikes WHERE id = ?', [id]);
}

// =====================================================
// Export
// =====================================================

module.exports = {
  findById,
  findAll,
  findAvailableAtStation,
  count,
  create,
  update,
  updateStatus,
  markAsRented,
  markAsReturned,
  deleteBike,
};
