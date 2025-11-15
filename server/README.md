# Seoul Bike Sharing Platform - Backend API Server

서울 따릉이 시뮬레이션 플랫폼의 RESTful API 백엔드 서버입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [API 문서](#api-문서)
- [개발 가이드](#개발-가이드)
- [환경 변수](#환경-변수)
- [데이터베이스](#데이터베이스)

---

## 프로젝트 개요

이 프로젝트는 서울 공공자전거 따릉이 시스템을 시뮬레이션하는 웹 애플리케이션의 백엔드 API 서버입니다.

### 주요 기능

- 🔐 **사용자 인증**: JWT 기반 인증 및 권한 관리
- 🚴 **대여소 관리**: 전체 대여소 조회, 실시간 현황, 가장 가까운 대여소 찾기
- 🚲 **자전거 대여/반납**: 자전거 대여 및 반납 트랜잭션 처리
- 📝 **커뮤니티 게시판**: 공지, 정보, 질문, 자유 게시판
- 🔧 **고장 신고**: 자전거 및 대여소 고장 신고 및 처리
- 🗺️ **경로 검색**: 대여소 간 경로 탐색 및 거리 계산
- 👤 **사용자 프로필**: 프로필 관리 및 대여 이력 조회
- 👨‍💼 **관리자 기능**: 통계, 사용자/대여소/자전거 관리

---

## 기술 스택

### 런타임 & 프레임워크
- **Node.js** v18.0.0 이상
- **Express** 4.18.2 - 웹 프레임워크

### 데이터베이스
- **MySQL** 8.0+ - 관계형 데이터베이스
- **mysql2** - MySQL 클라이언트 (Promise 지원)

### 인증 & 보안
- **JWT** (jsonwebtoken) - 토큰 기반 인증
- **bcryptjs** - 비밀번호 해싱
- **Helmet** - 보안 HTTP 헤더 설정
- **CORS** - Cross-Origin Resource Sharing

### 검증 & 로깅
- **express-validator** - 요청 데이터 검증
- **Morgan** - HTTP 요청 로깅

### 개발 도구
- **Nodemon** - 자동 재시작
- **Jest** - 테스트 프레임워크
- **ESLint** - 코드 품질 검사

---

## 시작하기

### 1. 사전 요구사항

- Node.js v18.0.0 이상
- npm v9.0.0 이상
- MySQL 8.0 이상

### 2. 설치

```bash
# 서버 디렉토리로 이동
cd server

# 의존성 설치
npm install
```

### 3. 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일을 편집하여 데이터베이스 정보 등을 입력
nano .env
```

필수 환경 변수:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=seoul_bike_sharing
JWT_SECRET=your_super_secret_key
```

### 4. 데이터베이스 초기화

```bash
# MySQL 접속
mysql -u root -p

# 스키마 파일 실행 (프로젝트 루트에서)
source ../schema.sql

# 또는 직접 실행
mysql -u root -p < ../schema.sql
```

### 5. 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

서버가 성공적으로 시작되면:
```
=============================================================
🚴 Seoul Bike Sharing Platform API Server
=============================================================
📍 Environment: development
🌐 Server running on: http://localhost:3000
📡 API Base URL: http://localhost:3000/api
💚 Health Check: http://localhost:3000/health
=============================================================
```

### 6. API 테스트

```bash
# 헬스 체크
curl http://localhost:3000/health

# 로그인 테스트
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

---

## 프로젝트 구조

```
server/
├── config/
│   └── database.js           # MySQL 연결 풀 설정
├── controllers/              # 비즈니스 로직
│   ├── auth.controller.js    # 인증 관련
│   ├── stations.controller.js # 대여소 관련
│   ├── rentals.controller.js # 대여/반납 관련
│   ├── posts.controller.js   # 게시판 관련
│   ├── repairs.controller.js # 고장 신고 관련
│   ├── routes.controller.js  # 경로 검색 관련
│   ├── users.controller.js   # 사용자 프로필 관련
│   └── admin.controller.js   # 관리자 기능
├── middleware/
│   ├── auth.js              # JWT 인증 미들웨어
│   ├── errorHandler.js      # 에러 처리 미들웨어
│   └── validateRequest.js   # 요청 검증 미들웨어
├── models/                  # 데이터베이스 모델
│   ├── User.model.js
│   ├── Station.model.js
│   ├── Bike.model.js
│   ├── Rental.model.js
│   ├── Post.model.js
│   ├── Repair.model.js
│   └── Route.model.js
├── routes/                  # 라우터 정의
│   ├── auth.routes.js
│   ├── stations.routes.js
│   ├── rentals.routes.js
│   ├── posts.routes.js
│   ├── repairs.routes.js
│   ├── routes.routes.js
│   ├── users.routes.js
│   └── admin.routes.js
├── utils/                   # 유틸리티 함수
│   ├── jwt.js              # JWT 헬퍼
│   ├── hash.js             # 비밀번호 해싱
│   ├── response.js         # 응답 포맷터
│   └── validation.js       # 검증 헬퍼
├── .env.example            # 환경 변수 예시
├── package.json            # 프로젝트 설정
├── server.js               # 서버 진입점
└── README.md               # 이 파일
```

---

## API 문서

### 기본 정보

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **Authorization**: `Bearer {token}` (인증 필요 시)

### 엔드포인트 그룹

#### 1. 인증 (Authentication)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | 로그인 | ❌ |
| POST | `/auth/signup` | 회원가입 | ❌ |
| GET | `/auth/check-email` | 이메일 중복 확인 | ❌ |

#### 2. 대여소 (Stations)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stations` | 대여소 목록 조회 | ❌ |
| GET | `/stations/status` | 실시간 현황 | ❌ |
| GET | `/stations/nearest` | 가장 가까운 대여소 | ❌ |

#### 3. 대여/반납 (Rentals)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/rentals` | 자전거 대여 | ✅ User |
| PUT | `/rentals/:id/return` | 자전거 반납 | ✅ User |
| GET | `/users/:userId/rentals` | 대여 이력 조회 | ✅ |

#### 4. 게시판 (Board)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/board/posts` | 게시글 목록 | ❌ |
| GET | `/board/posts/:id` | 게시글 상세 | ❌ |
| POST | `/board/posts` | 게시글 작성 | ✅ |
| PUT | `/board/posts/:id` | 게시글 수정 | ✅ Author |
| DELETE | `/board/posts/:id` | 게시글 삭제 | ✅ Author/Admin |

#### 5. 고장 신고 (Repairs)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/repairs/my` | 내 신고 내역 | ✅ |
| POST | `/repairs` | 고장 신고 | ✅ |
| GET | `/repairs/:id` | 신고 상세 | ✅ |

#### 6. 경로 검색 (Routes)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/routes/geocode` | 주소→좌표 변환 | ❌ |
| POST | `/routes/calculate` | 경로 계산 | ❌ |

#### 7. 사용자 (Users)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | 내 프로필 조회 | ✅ |
| PUT | `/users/me` | 프로필 수정 | ✅ |
| PUT | `/users/me/password` | 비밀번호 변경 | ✅ |

#### 8. 관리자 (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/statistics` | 대시보드 통계 | ✅ Admin |
| GET | `/admin/users` | 회원 목록 | ✅ Admin |
| PUT | `/admin/users/:id/status` | 회원 상태 변경 | ✅ Admin |
| GET | `/admin/stations` | 대여소 관리 | ✅ Admin |
| GET | `/admin/bikes` | 자전거 관리 | ✅ Admin |
| GET | `/admin/repairs` | 신고 내역 관리 | ✅ Admin |
| PUT | `/admin/repairs/:id` | 신고 상태 변경 | ✅ Admin |

### 표준 응답 형식

#### 성공 응답
```json
{
  "status": "success",
  "data": {
    // 응답 데이터
  },
  "metadata": {
    "timestamp": "2024-11-15T10:30:00Z",
    "version": "v1.0",
    "requestId": "req_abc123..."
  }
}
```

#### 에러 응답
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "details": {
      "field": "password"
    }
  },
  "metadata": {
    "timestamp": "2024-11-15T10:30:00Z",
    "version": "v1.0",
    "requestId": "req_abc123..."
  }
}
```

---

## 개발 가이드

### 새로운 API 엔드포인트 추가하기

1. **라우터 정의** (`routes/*.routes.js`)
```javascript
router.post('/new-endpoint', authenticate, validateSomething, controller.newFunction);
```

2. **컨트롤러 구현** (`controllers/*.controller.js`)
```javascript
async function newFunction(req, res, next) {
  try {
    const data = await Model.someMethod();
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
}
```

3. **모델 메서드 추가** (`models/*.model.js`)
```javascript
async function someMethod() {
  const [rows] = await db.execute('SELECT * FROM table');
  return rows;
}
```

### 검증 규칙 추가하기

`middleware/validateRequest.js`에서 검증 체인을 정의:

```javascript
const validateSomething = [
  body('field').isString().notEmpty(),
  handleValidationErrors,
];
```

### 에러 처리

모든 에러는 중앙 에러 핸들러로 전달:

```javascript
// 커스텀 에러 생성
const error = new ValidationError('Invalid input');
next(error);
```

### 트랜잭션 사용

```javascript
const result = await db.transaction(async (connection) => {
  await connection.execute('UPDATE bikes SET status = ?', ['rented']);
  await connection.execute('UPDATE stations SET bike_count = bike_count - 1');
  await connection.execute('INSERT INTO rentals ...');
  return { success: true };
});
```

---

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NODE_ENV` | 실행 환경 | `development` |
| `PORT` | 서버 포트 | `3000` |
| `DB_HOST` | MySQL 호스트 | `localhost` |
| `DB_PORT` | MySQL 포트 | `3306` |
| `DB_USER` | MySQL 사용자 | `root` |
| `DB_PASSWORD` | MySQL 비밀번호 | `` |
| `DB_NAME` | 데이터베이스 이름 | `seoul_bike_sharing` |
| `JWT_SECRET` | JWT 서명 비밀키 | `` |
| `JWT_EXPIRES_IN` | JWT 유효기간 | `7d` |
| `BCRYPT_ROUNDS` | Bcrypt Salt 라운드 | `10` |
| `CORS_ORIGIN` | 허용할 Origin | `http://localhost:5173` |

---

## 데이터베이스

### 테이블 구조

- **users**: 사용자 계정
- **stations**: 대여소 정보
- **bikes**: 자전거 정보
- **rentals**: 대여/반납 기록
- **posts**: 게시판 글
- **repairs**: 고장 신고
- **routes**: 경로 검색 이력

자세한 스키마는 `../database-schema.md` 참고

### 마이그레이션

```bash
# 초기 스키마 적용
mysql -u root -p < ../schema.sql

# 스키마 백업
mysqldump -u root -p seoul_bike_sharing > backup.sql
```

---

## 테스트

```bash
# 전체 테스트 실행
npm test

# 커버리지 리포트
npm test -- --coverage
```

---

## 라이선스

MIT

---

## 문의

Seoul Bike Team - seoul-bike@example.com

프로젝트 링크: [https://github.com/your-repo/seoul-bicycle-web](https://github.com/your-repo/seoul-bicycle-web)
