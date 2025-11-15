/**
 * =====================================================
 * Seoul Bike Sharing Platform - Main Server Entry Point
 * =====================================================
 *
 * 이 파일은 Express 서버의 진입점입니다.
 * 모든 미들웨어, 라우터, 에러 핸들러를 설정하고 서버를 시작합니다.
 *
 * 주요 기능:
 * - Express 앱 초기화 및 설정
 * - 전역 미들웨어 등록 (CORS, JSON 파싱, 로깅 등)
 * - API 라우터 연결
 * - 데이터베이스 연결 확인
 * - 에러 핸들링
 * - 서버 시작 및 Graceful Shutdown 처리
 */

// =====================================================
// 필수 모듈 임포트
// =====================================================
require('dotenv').config(); // 환경 변수 로드
const express = require('express');
const cors = require('cors'); // Cross-Origin Resource Sharing
const helmet = require('helmet'); // 보안 헤더 설정
const morgan = require('morgan'); // HTTP 요청 로깅
const compression = require('compression'); // 응답 압축

// 데이터베이스 연결
const db = require('./config/database');

// 미들웨어
const errorHandler = require('./middleware/errorHandler');

// 라우터
const authRoutes = require('./routes/auth.routes');
const stationsRoutes = require('./routes/stations.routes');
const rentalsRoutes = require('./routes/rentals.routes');
const postsRoutes = require('./routes/posts.routes');
const repairsRoutes = require('./routes/repairs.routes');
const routesRoutes = require('./routes/routes.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');

// =====================================================
// Express 앱 초기화
// =====================================================
const app = express();

// 환경 변수 설정
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_PREFIX = process.env.API_PREFIX || '/api';

// =====================================================
// 전역 미들웨어 설정
// =====================================================

/**
 * 1. Helmet - 보안 관련 HTTP 헤더 설정
 * - XSS, Clickjacking, MIME sniffing 등 다양한 공격으로부터 보호
 */
app.use(helmet());

/**
 * 2. CORS - Cross-Origin Resource Sharing 설정
 * - 프론트엔드 (Vite 개발 서버)에서의 API 호출 허용
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * 3. 요청 본문 파싱 미들웨어
 * - JSON 형식의 요청 본문을 파싱 (최대 10MB)
 * - URL-encoded 데이터 파싱 (폼 데이터)
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 4. 압축 미들웨어
 * - 응답을 gzip으로 압축하여 전송 (네트워크 대역폭 절약)
 */
app.use(compression());

/**
 * 5. Morgan - HTTP 요청 로깅
 * - 개발 환경: 상세한 로그 (dev)
 * - 프로덕션: 간결한 로그 (combined)
 */
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

/**
 * 6. 정적 파일 제공 (업로드 파일 등)
 * - 향후 이미지 업로드 기능 추가 시 사용
 */
// app.use('/uploads', express.static('uploads'));

// =====================================================
// 헬스 체크 엔드포인트
// =====================================================

/**
 * GET /health
 *
 * 서버 상태 확인 엔드포인트
 * - 로드 밸런서나 모니터링 도구에서 서버 상태 체크
 * - 데이터베이스 연결 상태도 함께 확인
 */
app.get('/health', async (req, res) => {
  try {
    // 데이터베이스 연결 테스트
    await db.query('SELECT 1');

    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: 'disconnected',
      error: error.message
    });
  }
});

/**
 * GET /
 *
 * API 루트 엔드포인트
 * - API 기본 정보 및 사용 가능한 엔드포인트 안내
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Seoul Bike Sharing Platform API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      stations: `${API_PREFIX}/stations`,
      rentals: `${API_PREFIX}/rentals`,
      posts: `${API_PREFIX}/board/posts`,
      repairs: `${API_PREFIX}/repairs`,
      routes: `${API_PREFIX}/routes`,
      users: `${API_PREFIX}/users`,
      admin: `${API_PREFIX}/admin`
    }
  });
});

// =====================================================
// API 라우터 등록
// =====================================================

/**
 * 모든 API 엔드포인트는 /api 접두사를 사용합니다.
 * 각 라우터는 독립적인 파일로 분리되어 관리됩니다.
 */
app.use(`${API_PREFIX}/auth`, authRoutes);           // 인증 관련 API
app.use(`${API_PREFIX}/stations`, stationsRoutes);   // 대여소 API
app.use(`${API_PREFIX}/rentals`, rentalsRoutes);     // 대여/반납 API
app.use(`${API_PREFIX}/board`, postsRoutes);         // 게시판 API
app.use(`${API_PREFIX}/repairs`, repairsRoutes);     // 고장 신고 API
app.use(`${API_PREFIX}/routes`, routesRoutes);       // 경로 검색 API (이름 충돌 주의)
app.use(`${API_PREFIX}/users`, usersRoutes);         // 사용자 프로필 API
app.use(`${API_PREFIX}/admin`, adminRoutes);         // 관리자 API

// =====================================================
// 404 에러 핸들러
// =====================================================

/**
 * 정의되지 않은 라우트에 대한 404 응답
 * - 모든 라우터 등록 후 마지막에 위치해야 함
 */
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// 전역 에러 핸들러
// =====================================================

/**
 * 모든 에러를 처리하는 중앙 집중식 에러 핸들러
 * - Express의 에러 핸들링 미들웨어 (4개의 매개변수)
 * - 비동기 에러, 데이터베이스 에러, 검증 에러 등 모두 처리
 */
app.use(errorHandler);

// =====================================================
// 데이터베이스 연결 테스트
// =====================================================

/**
 * 서버 시작 전 데이터베이스 연결 확인
 * - 연결 실패 시 서버를 시작하지 않음
 */
async function testDatabaseConnection() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    return false;
  }
}

// =====================================================
// 서버 시작
// =====================================================

/**
 * HTTP 서버 시작 함수
 * - 비동기로 데이터베이스 연결을 먼저 확인
 * - 성공 시 서버 리스닝 시작
 */
async function startServer() {
  // 데이터베이스 연결 확인
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.error('⚠️  Server will not start due to database connection failure');
    process.exit(1); // 비정상 종료
  }

  // 서버 시작
  const server = app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚴 Seoul Bike Sharing Platform API Server');
    console.log('='.repeat(60));
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}${API_PREFIX}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log('='.repeat(60));
  });

  // =====================================================
  // Graceful Shutdown 처리
  // =====================================================

  /**
   * 서버 종료 시 리소스 정리
   * - SIGTERM, SIGINT 신호 수신 시 실행
   * - 진행 중인 요청 완료 대기
   * - 데이터베이스 연결 종료
   */
  const gracefulShutdown = async (signal) => {
    console.log(`\n⚠️  ${signal} signal received: closing HTTP server`);

    server.close(async () => {
      console.log('✅ HTTP server closed');

      // 데이터베이스 연결 종료
      try {
        await db.end();
        console.log('✅ Database connections closed');
      } catch (error) {
        console.error('❌ Error closing database connections:', error.message);
      }

      console.log('👋 Server shutdown complete');
      process.exit(0);
    });

    // 10초 후 강제 종료 (타임아웃)
    setTimeout(() => {
      console.error('⏰ Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  // 시그널 핸들러 등록
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // 처리되지 않은 Promise Rejection 핸들러
  process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
    // 프로덕션에서는 로깅 후 재시작 고려
  });

  // 처리되지 않은 예외 핸들러
  process.on('uncaughtException', (error) => {
    console.error('⚠️  Uncaught Exception:', error);
    // 심각한 에러이므로 서버 종료
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });
}

// 서버 시작 실행
startServer();

// Express 앱 내보내기 (테스트용)
module.exports = app;
