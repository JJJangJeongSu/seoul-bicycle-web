/**
 * =====================================================
 * Route Model
 * =====================================================
 *
 * 경로 검색 이력 데이터베이스 작업을 처리하는 모델
 *
 * Table: routes
 * Columns:
 * - id: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
 * - user_id: VARCHAR(50) (nullable)
 * - start_station_id: VARCHAR(10)
 * - end_station_id: VARCHAR(10)
 * - distance: DECIMAL(6, 2)
 * - duration: INT UNSIGNED
 * - walking_distance_to_start: DECIMAL(5, 2)
 * - walking_distance_from_end: DECIMAL(5, 2)
 * - created_at: TIMESTAMP
 */

const db = require('../config/database');

// =====================================================
// 조회 (Read)
// =====================================================

/**
 * ID로 경로 조회
 *
 * @param {number} id - 경로 ID
 * @returns {Promise<Object|null>} 경로 객체 또는 null
 */
async function findById(id) {
  // TODO: ID로 경로 조회
  const [rows] = await db.execute(
    'SELECT * FROM routes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * 사용자 ID로 경로 검색 이력 조회
 *
 * @param {string} userId - 사용자 ID
 * @param {Object} options - 조회 옵션
 * @param {number} options.limit - 제한 개수 (optional)
 * @param {number} options.offset - 오프셋 (optional)
 * @returns {Promise<Array>} 경로 배열
 */
async function findByUser(userId, options = {}) {
  // TODO: 사용자의 경로 검색 이력 조회
  // let sql = `
  //   SELECT
  //     r.*,
  //     ss.name as start_station_name,
  //     es.name as end_station_name
  //   FROM routes r
  //   LEFT JOIN stations ss ON r.start_station_id = ss.id
  //   LEFT JOIN stations es ON r.end_station_id = es.id
  //   WHERE r.user_id = ?
  //   ORDER BY r.created_at DESC
  // `;
  // const params = [userId];
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
 * 최근 인기 경로 조회 (가장 많이 검색된 경로)
 *
 * @param {number} limit - 제한 개수
 * @returns {Promise<Array>} 인기 경로 배열
 */
async function findPopularRoutes(limit = 10) {
  // TODO: 가장 많이 검색된 경로 조회
  // const [rows] = await db.execute(
  //   `SELECT
  //      start_station_id,
  //      end_station_id,
  //      COUNT(*) as search_count,
  //      AVG(distance) as avg_distance,
  //      AVG(duration) as avg_duration
  //    FROM routes
  //    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  //    GROUP BY start_station_id, end_station_id
  //    ORDER BY search_count DESC
  //    LIMIT ?`,
  //   [limit]
  // );
  // return rows;

  return [];
}

// =====================================================
// 생성 (Create)
// =====================================================

/**
 * 새 경로 검색 이력 생성
 *
 * @param {Object} routeData - 경로 데이터
 * @param {string} routeData.userId - 사용자 ID (nullable)
 * @param {string} routeData.startStationId - 출발 대여소 ID
 * @param {string} routeData.endStationId - 도착 대여소 ID
 * @param {number} routeData.distance - 거리 (km)
 * @param {number} routeData.duration - 소요 시간 (분)
 * @param {number} routeData.walkingDistanceToStart - 출발 대여소까지 도보 거리 (km)
 * @param {number} routeData.walkingDistanceFromEnd - 도착 대여소에서 도보 거리 (km)
 * @returns {Promise<Object>} 생성된 경로 객체
 */
async function create(routeData) {
  // TODO: 경로 검색 이력 생성
  // const {
  //   userId,
  //   startStationId,
  //   endStationId,
  //   distance,
  //   duration,
  //   walkingDistanceToStart,
  //   walkingDistanceFromEnd,
  // } = routeData;
  //
  // const [result] = await db.execute(
  //   `INSERT INTO routes
  //    (user_id, start_station_id, end_station_id, distance, duration, walking_distance_to_start, walking_distance_from_end)
  //    VALUES (?, ?, ?, ?, ?, ?, ?)`,
  //   [
  //     userId || null,
  //     startStationId,
  //     endStationId,
  //     distance,
  //     duration,
  //     walkingDistanceToStart,
  //     walkingDistanceFromEnd,
  //   ]
  // );
  //
  // return await findById(result.insertId);

  return null;
}

// =====================================================
// 삭제 (Delete)
// =====================================================

/**
 * 경로 검색 이력 삭제
 *
 * @param {number} id - 경로 ID
 * @returns {Promise<void>}
 */
async function deleteRoute(id) {
  // TODO: 경로 삭제
  // await db.execute('DELETE FROM routes WHERE id = ?', [id]);
}

/**
 * 사용자의 모든 경로 검색 이력 삭제
 *
 * @param {string} userId - 사용자 ID
 * @returns {Promise<void>}
 */
async function deleteByUser(userId) {
  // TODO: 사용자의 모든 경로 삭제
  // await db.execute('DELETE FROM routes WHERE user_id = ?', [userId]);
}

/**
 * 오래된 경로 검색 이력 삭제 (데이터 정리용)
 *
 * @param {number} days - 유지 기간 (일)
 * @returns {Promise<void>}
 */
async function deleteOldRoutes(days = 90) {
  // TODO: 지정된 기간보다 오래된 경로 삭제
  // await db.execute(
  //   'DELETE FROM routes WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
  //   [days]
  // );
}

// =====================================================
// Export
// =====================================================

module.exports = {
  findById,
  findByUser,
  findPopularRoutes,
  create,
  deleteRoute,
  deleteByUser,
  deleteOldRoutes,
};
