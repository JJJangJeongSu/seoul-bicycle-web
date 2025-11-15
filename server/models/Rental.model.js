/**
 * =====================================================
 * Rental Model
 * =====================================================
 *
 * 대여 기록 데이터베이스 작업을 처리하는 모델
 *
 * Table: rentals
 * Columns:
 * - id: VARCHAR(20) PRIMARY KEY
 * - user_id: VARCHAR(50)
 * - bike_id: VARCHAR(15)
 * - start_station_id: VARCHAR(10)
 * - end_station_id: VARCHAR(10) (nullable)
 * - rental_time: TIMESTAMP
 * - return_time: TIMESTAMP (nullable)
 * - duration: INT UNSIGNED (nullable)
 * - distance: DECIMAL(6, 2) (nullable)
 * - status: ENUM('rented', 'returned')
 * - created_at: TIMESTAMP
 * - updated_at: TIMESTAMP
 */

const db = require('../config/database');

// =====================================================
// 조회 (Read)
// =====================================================

/**
 * ID로 대여 정보 조회
 *
 * @param {string} id - 대여 ID
 * @returns {Promise<Object|null>} 대여 객체 또는 null
 */
async function findById(id) {
  // TODO: ID로 대여 정보 조회
  const [rows] = await db.execute(
    'SELECT * FROM rentals WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * 사용자 ID로 활성 대여 조회
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object|null>} 대여 객체 또는 null
 */
async function findActiveByUserId(userId) {
  // TODO: 사용자의 활성(대여 중) 대여 조회
  const [rows] = await db.execute(
    'SELECT * FROM rentals WHERE user_id = ? AND status = ? LIMIT 1',
    [userId, 'rented']
  );
  return rows[0] || null;
}

/**
 * 사용자 ID로 대여 이력 조회 (페이지네이션)
 *
 * @param {string} userId - 사용자 ID
 * @param {Object} options - 조회 옵션
 * @param {string} options.status - 상태 필터 (optional)
 * @param {number} options.limit - 제한 개수 (optional)
 * @param {number} options.offset - 오프셋 (optional)
 * @returns {Promise<Object>} { rentals: Array, totalCount: number }
 */
async function findByUser(userId, options = {}) {
  // TODO: 사용자의 대여 이력 조회
  // let sql = `
  //   SELECT
  //     r.*,
  //     ss.name as start_station_name,
  //     es.name as end_station_name
  //   FROM rentals r
  //   LEFT JOIN stations ss ON r.start_station_id = ss.id
  //   LEFT JOIN stations es ON r.end_station_id = es.id
  //   WHERE r.user_id = ?
  // `;
  // const params = [userId];
  //
  // if (options.status) {
  //   sql += ' AND r.status = ?';
  //   params.push(options.status);
  // }
  //
  // // 전체 개수 조회
  // const countSql = `SELECT COUNT(*) as count FROM rentals WHERE user_id = ?${options.status ? ' AND status = ?' : ''}`;
  // const [countRows] = await db.execute(countSql, options.status ? [userId, options.status] : [userId]);
  // const totalCount = countRows[0].count;
  //
  // // 정렬 및 페이지네이션
  // sql += ' ORDER BY r.rental_time DESC';
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
  //   rentals: rows,
  //   totalCount,
  // };

  return {
    rentals: [],
    totalCount: 0,
  };
}

/**
 * 사용자 대여 통계 조회
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} { totalRentals, totalDistance, totalDuration }
 */
async function getUserStatistics(userId) {
  // TODO: 사용자의 대여 통계 계산
  // const [rows] = await db.execute(
  //   `SELECT
  //      COUNT(*) as total_rentals,
  //      COALESCE(SUM(distance), 0) as total_distance,
  //      COALESCE(SUM(duration), 0) as total_duration
  //    FROM rentals
  //    WHERE user_id = ? AND status = ?`,
  //   [userId, 'returned']
  // );
  //
  // return {
  //   totalRentals: rows[0].total_rentals,
  //   totalDistance: parseFloat(rows[0].total_distance) || 0,
  //   totalDuration: rows[0].total_duration || 0,
  // };

  return {
    totalRentals: 0,
    totalDistance: 0,
    totalDuration: 0,
  };
}

/**
 * 대여 수 카운트
 *
 * @param {Object} filters - 필터 조건
 * @returns {Promise<number>} 대여 수
 */
async function count(filters = {}) {
  // TODO: 조건에 맞는 대여 수 카운트
  // let sql = 'SELECT COUNT(*) as count FROM rentals WHERE 1=1';
  // const params = [];
  //
  // if (filters.status) {
  //   sql += ' AND status = ?';
  //   params.push(filters.status);
  // }
  //
  // if (filters.userId) {
  //   sql += ' AND user_id = ?';
  //   params.push(filters.userId);
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
 * 새 대여 생성
 *
 * @param {Object} rentalData - 대여 데이터
 * @returns {Promise<Object>} 생성된 대여 객체
 */
async function create(rentalData) {
  // TODO: 대여 생성
  // const { id, userId, bikeId, startStationId, rentalTime, status } = rentalData;
  //
  // await db.execute(
  //   'INSERT INTO rentals (id, user_id, bike_id, start_station_id, rental_time, status) VALUES (?, ?, ?, ?, ?, ?)',
  //   [id, userId, bikeId, startStationId, rentalTime, status || 'rented']
  // );
  //
  // return await findById(id);

  return null;
}

// =====================================================
// 수정 (Update)
// =====================================================

/**
 * 대여 반납 처리
 *
 * @param {string} id - 대여 ID
 * @param {Object} returnData - 반납 데이터
 * @param {string} returnData.endStationId - 반납 대여소 ID
 * @param {Date} returnData.returnTime - 반납 시간
 * @param {number} returnData.duration - 이용 시간 (분)
 * @param {number} returnData.distance - 이동 거리 (km)
 * @returns {Promise<Object>} 업데이트된 대여 객체
 */
async function markAsReturned(id, returnData) {
  // TODO: 대여 반납 처리
  // const { endStationId, returnTime, duration, distance } = returnData;
  //
  // await db.execute(
  //   'UPDATE rentals SET end_station_id = ?, return_time = ?, duration = ?, distance = ?, status = ? WHERE id = ?',
  //   [endStationId, returnTime, duration, distance, 'returned', id]
  // );
  //
  // return await findById(id);

  return null;
}

// =====================================================
// 삭제 (Delete)
// =====================================================

/**
 * 대여 기록 삭제
 *
 * @param {string} id - 대여 ID
 * @returns {Promise<void>}
 */
async function deleteRental(id) {
  // TODO: 대여 기록 삭제
  // await db.execute('DELETE FROM rentals WHERE id = ?', [id]);
}

// =====================================================
// Export
// =====================================================

module.exports = {
  findById,
  findActiveByUserId,
  findByUser,
  getUserStatistics,
  count,
  create,
  markAsReturned,
  deleteRental,
};
