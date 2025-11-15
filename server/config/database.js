/**
 * =====================================================
 * Database Configuration - MySQL Connection Pool
 * =====================================================
 *
 * MySQL 데이터베이스 연결 풀을 생성하고 관리합니다.
 *
 * 주요 기능:
 * - MySQL 연결 풀 생성 (재사용 가능한 연결 관리)
 * - Promise 기반 쿼리 인터페이스 제공
 * - 연결 상태 모니터링
 * - 쿼리 로깅 (개발 환경)
 *
 * 사용법:
 * const db = require('./config/database');
 * const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
 */

const mysql = require('mysql2');

// =====================================================
// 환경 변수 로드 및 검증
// =====================================================

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'seoul_bike_sharing',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,

  // 연결 설정
  waitForConnections: true,       // 연결 풀이 가득 찬 경우 대기
  queueLimit: 0,                  // 대기 큐 제한 없음 (무제한)
  enableKeepAlive: true,          // Keep-Alive 활성화 (연결 유지)
  keepAliveInitialDelay: 0,       // Keep-Alive 초기 지연 시간

  // MySQL 특정 설정
  charset: 'utf8mb4',             // 한글 및 이모지 지원
  timezone: '+00:00',             // UTC 타임존 사용
  dateStrings: false,             // Date 객체로 변환

  // 재연결 설정
  connectTimeout: 10000,          // 연결 타임아웃: 10초
  acquireTimeout: 10000,          // 연결 획득 타임아웃: 10초
  timeout: 60000,                 // 쿼리 타임아웃: 60초
};

// =====================================================
// 연결 풀 생성
// =====================================================

/**
 * MySQL 연결 풀
 * - 여러 연결을 미리 생성하여 재사용
 * - 성능 향상 및 리소스 효율성
 */
const pool = mysql.createPool(dbConfig);

/**
 * Promise 기반 연결 풀
 * - async/await 문법 사용 가능
 * - 에러 핸들링 개선
 */
const promisePool = pool.promise();

// =====================================================
// 연결 풀 이벤트 리스너
// =====================================================

/**
 * 연결 획득 이벤트
 * - 풀에서 연결을 가져올 때 발생
 */
pool.on('acquire', (connection) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔗 Connection ${connection.threadId} acquired from pool`);
  }
});

/**
 * 연결 해제 이벤트
 * - 연결이 풀로 반환될 때 발생
 */
pool.on('release', (connection) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔓 Connection ${connection.threadId} released back to pool`);
  }
});

/**
 * 연결 생성 이벤트
 * - 새로운 연결이 풀에 추가될 때 발생
 */
pool.on('connection', (connection) => {
  console.log(`✨ New connection created (ID: ${connection.threadId})`);

  // 각 연결에 대한 기본 설정
  connection.query('SET SESSION sql_mode="STRICT_ALL_TABLES"', (error) => {
    if (error) {
      console.error('❌ Error setting SQL mode:', error);
    }
  });
});

/**
 * 연결 대기 이벤트
 * - 사용 가능한 연결이 없어 대기 중일 때 발생
 */
pool.on('enqueue', () => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⏳ Waiting for available connection slot');
  }
});

// =====================================================
// 유틸리티 함수
// =====================================================

/**
 * 데이터베이스 연결 테스트
 * @returns {Promise<boolean>} 연결 성공 여부
 */
async function testConnection() {
  try {
    const [rows] = await promisePool.query('SELECT 1 AS result');
    return rows[0].result === 1;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    throw error;
  }
}

/**
 * 트랜잭션 헬퍼 함수
 * @param {Function} callback - 트랜잭션 내에서 실행할 함수
 * @returns {Promise<any>} 콜백 함수의 반환값
 *
 * 사용 예시:
 * const result = await db.transaction(async (connection) => {
 *   await connection.query('INSERT INTO users ...');
 *   await connection.query('INSERT INTO rentals ...');
 *   return { success: true };
 * });
 */
async function transaction(callback) {
  const connection = await promisePool.getConnection();

  try {
    // 트랜잭션 시작
    await connection.beginTransaction();
    console.log('🔄 Transaction started');

    // 콜백 함수 실행
    const result = await callback(connection);

    // 커밋
    await connection.commit();
    console.log('✅ Transaction committed');

    return result;
  } catch (error) {
    // 롤백
    await connection.rollback();
    console.error('⚠️  Transaction rolled back:', error.message);
    throw error;
  } finally {
    // 연결 반환
    connection.release();
  }
}

/**
 * 쿼리 로깅 래퍼 (개발 환경)
 * @param {string} sql - SQL 쿼리
 * @param {Array} params - 쿼리 파라미터
 * @returns {Promise<any>} 쿼리 결과
 */
async function queryWithLogging(sql, params = []) {
  const start = Date.now();

  try {
    const result = await promisePool.query(sql, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Query executed in ${duration}ms:`, sql.substring(0, 100));
    }

    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * 연결 풀 상태 확인
 * @returns {Object} 연결 풀 통계
 */
function getPoolStats() {
  return {
    totalConnections: pool._allConnections.length,
    freeConnections: pool._freeConnections.length,
    activeConnections: pool._allConnections.length - pool._freeConnections.length,
    queuedRequests: pool._connectionQueue.length,
  };
}

/**
 * 연결 풀 종료
 * - 모든 연결을 정상적으로 닫음
 * - Graceful Shutdown 시 사용
 */
async function closePool() {
  try {
    await promisePool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing connection pool:', error.message);
    throw error;
  }
}

// =====================================================
// 내보내기
// =====================================================

module.exports = {
  // 기본 쿼리 메서드
  query: promisePool.query.bind(promisePool),
  execute: promisePool.execute.bind(promisePool), // Prepared statement

  // 연결 관리
  getConnection: promisePool.getConnection.bind(promisePool),
  end: closePool,

  // 유틸리티 함수
  transaction,
  testConnection,
  queryWithLogging,
  getPoolStats,

  // 원시 풀 객체 (필요 시)
  pool,
  promisePool,
};

// =====================================================
// 초기화 로그
// =====================================================

console.log('📦 Database module loaded');
console.log(`🔧 Database: ${dbConfig.database}`);
console.log(`🔧 Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`🔧 Connection Limit: ${dbConfig.connectionLimit}`);
