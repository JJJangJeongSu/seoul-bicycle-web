# Database Schema Documentation

## 서울 따릉이 시뮬레이션 플랫폼 데이터베이스 명세서

**버전**: 1.0.0
**최종 수정일**: 2025-11-15
**데이터베이스**: MySQL 8.0+
**문자셋**: utf8mb4 (한글 및 이모지 지원)
**Collation**: utf8mb4_unicode_ci
**스토리지 엔진**: InnoDB

---

## 목차

1. [개요](#개요)
2. [ERD (Entity Relationship Diagram)](#erd)
3. [테이블 명세](#테이블-명세)
   - [users](#1-users)
   - [stations](#2-stations)
   - [bikes](#3-bikes)
   - [rentals](#4-rentals)
   - [posts](#5-posts)
   - [repairs](#6-repairs)
   - [routes](#7-routes)
4. [인덱싱 전략](#인덱싱-전략)
5. [외래 키 정책](#외래-키-정책)
6. [비즈니스 규칙](#비즈니스-규칙)

---

## 개요

본 데이터베이스는 서울 공공자전거 따릉이 시스템을 시뮬레이션하는 웹 애플리케이션의 백엔드 데이터 저장소입니다.

### 주요 기능

- **사용자 관리**: 일반 사용자 및 관리자 계정 관리
- **대여소 관리**: 전체 대여소 위치 및 현황 관리
- **자전거 관리**: 개별 자전거 상태 및 위치 추적
- **대여/반납**: 자전거 대여 및 반납 트랜잭션 처리
- **커뮤니티**: 사용자 게시판 (공지, 정보, 질문, 자유)
- **고장 신고**: 자전거 및 대여소 고장 신고 및 처리
- **경로 검색**: 대여소 간 경로 탐색 이력

### 데이터베이스 특징

- **트랜잭션 지원**: InnoDB 엔진을 사용하여 ACID 보장
- **참조 무결성**: 외래 키 제약조건으로 데이터 일관성 유지
- **성능 최적화**: 자주 조회되는 컬럼에 인덱스 설정
- **한글 지원**: utf8mb4 문자셋으로 완벽한 한글 처리
- **타임존**: TIMESTAMP 타입으로 UTC 기준 시간 저장

---

## ERD

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   users     │◄────────┤   rentals    ├────────►│   bikes     │
│             │         │              │         │             │
│ * id (PK)   │         │ * id (PK)    │         │ * id (PK)   │
│   email     │         │   user_id    │         │   status    │
│   name      │         │   bike_id    │         └──────┬──────┘
│   role      │         │   start_sta  │                │
└──────┬──────┘         │   end_sta    │                │
       │                │   status     │                │
       │                └──────┬───────┘                │
       │                       │                        │
       │                ┌──────▼───────┐                │
       │                │  stations    │◄───────────────┘
       │                │              │
       │                │ * id (PK)    │
       │                │   name       │
       │                │   latitude   │
       │                │   longitude  │
       │                │   bike_count │
       │                └──────────────┘
       │                       ▲
       │                       │
       ├───────────────────────┼───────────────┐
       │                       │               │
┌──────▼──────┐         ┌──────┴──────┐  ┌─────▼──────┐
│   posts     │         │  repairs    │  │   routes   │
│             │         │             │  │            │
│ * id (PK)   │         │ * id (PK)   │  │ * id (PK)  │
│   author_id │         │   reporter  │  │   user_id  │
│   category  │         │   type      │  │   start_st │
│   title     │         │   bike_id   │  │   end_st   │
│   content   │         │   station_id│  └────────────┘
└─────────────┘         │   status    │
                        └─────────────┘
```

---

## 테이블 명세

### 1. users

**설명**: 사용자 계정 정보 (일반 사용자 및 관리자)

**테이블명**: `users`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | VARCHAR(50) | NO | - | PK | 사용자 고유 ID |
| email | VARCHAR(255) | NO | - | UNIQUE | 이메일 주소 (로그인 ID) |
| password_hash | VARCHAR(255) | NO | - | - | bcrypt 해시된 비밀번호 |
| name | VARCHAR(100) | NO | - | - | 사용자 이름 |
| phone | VARCHAR(20) | NO | - | - | 전화번호 (형식: 010-XXXX-XXXX) |
| role | ENUM | NO | 'user' | - | 사용자 역할 (user, admin) |
| status | ENUM | NO | 'active' | - | 계정 상태 (active, blocked) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 계정 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE | 마지막 수정 시간 |

#### 인덱스

- **PRIMARY KEY**: `id`
- **UNIQUE KEY**: `uk_users_email` (email)
- **KEY**: `idx_users_role` (role)
- **KEY**: `idx_users_status` (status)
- **KEY**: `idx_users_created_at` (created_at)

#### 비즈니스 규칙

- `email`은 고유해야 하며, 로그인 ID로 사용됩니다
- `password_hash`는 bcrypt 알고리즘으로 해시되어 저장됩니다 (비용 인자: 10)
- `phone`은 한국 휴대폰 번호 형식 (010-XXXX-XXXX)을 따릅니다
- `role`이 'admin'인 경우 관리자 전용 기능에 접근할 수 있습니다
- `status`가 'blocked'인 경우 로그인이 차단됩니다

#### 샘플 데이터

```sql
-- 관리자 계정 (email: admin@test.com)
id: '1'
email: 'admin@test.com'
name: '관리자'
role: 'admin'

-- 일반 사용자 (email: user@test.com)
id: '2'
email: 'user@test.com'
name: '홍길동'
role: 'user'
```

---

### 2. stations

**설명**: 따릉이 대여소 정보

**테이블명**: `stations`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | VARCHAR(10) | NO | - | PK | 대여소 고유 ID (형식: ST-XXX) |
| name | VARCHAR(200) | NO | - | - | 대여소 이름 |
| address | VARCHAR(500) | NO | - | - | 대여소 주소 |
| latitude | DECIMAL(10,7) | NO | - | - | 위도 |
| longitude | DECIMAL(10,7) | NO | - | - | 경도 |
| bike_count | INT UNSIGNED | NO | 0 | - | 현재 대여 가능한 자전거 수 |
| capacity | INT UNSIGNED | NO | - | - | 대여소 최대 수용 대수 |
| status | ENUM | NO | 'active' | - | 대여소 운영 상태 (active, inactive) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 대여소 등록 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE | 마지막 수정 시간 |

#### 인덱스

- **PRIMARY KEY**: `id`
- **KEY**: `idx_stations_status` (status)
- **KEY**: `idx_stations_location` (latitude, longitude) - 공간 검색 최적화
- **KEY**: `idx_stations_bike_count` (bike_count) - 자전거 재고 조회
- **KEY**: `idx_stations_name` (name) - 이름 검색

#### 비즈니스 규칙

- `id`는 "ST-XXX" 형식을 따릅니다 (예: ST-001, ST-002)
- `bike_count`는 항상 0 이상이며, `capacity`를 초과할 수 없습니다
- `latitude`, `longitude`는 소수점 7자리까지 저장하여 약 1cm 정밀도를 제공합니다
- `status`가 'inactive'인 대여소는 대여/반납이 불가능합니다
- 가장 가까운 대여소 찾기는 Haversine 공식을 사용합니다

#### 샘플 데이터

```sql
id: 'ST-001'
name: '강남역 1번출구'
address: '서울특별시 강남구 강남대로 396'
latitude: 37.497900
longitude: 127.027600
bike_count: 12
capacity: 20
status: 'active'
```

---

### 3. bikes

**설명**: 자전거 정보

**테이블명**: `bikes`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | VARCHAR(15) | NO | - | PK | 자전거 고유 ID (형식: SPB-XXXXX) |
| current_station_id | VARCHAR(10) | YES | NULL | FK→stations | 현재 위치한 대여소 ID (대여 중이면 NULL) |
| status | ENUM | NO | 'available' | - | 자전거 상태 |
| model | VARCHAR(100) | YES | NULL | - | 자전거 모델명 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 자전거 등록 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE | 마지막 수정 시간 |

#### ENUM 값

- **status**: 'available', 'rented', 'maintenance', 'broken'

#### 인덱스

- **PRIMARY KEY**: `id`
- **KEY**: `idx_bikes_current_station` (current_station_id)
- **KEY**: `idx_bikes_status` (status)

#### 외래 키

- **fk_bikes_station**: `current_station_id` → `stations(id)`
  - ON DELETE: SET NULL (대여소 삭제 시 NULL 처리)
  - ON UPDATE: CASCADE

#### 비즈니스 규칙

- `id`는 "SPB-XXXXX" 형식을 따릅니다 (SPB = Seoul Public Bike)
- `status`가 'available'일 때만 대여 가능합니다
- 대여 중(`status='rented'`)인 자전거는 `current_station_id`가 NULL입니다
- `status`가 'broken' 또는 'maintenance'인 자전거는 대여가 불가능합니다

---

### 4. rentals

**설명**: 자전거 대여/반납 기록

**테이블명**: `rentals`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | VARCHAR(20) | NO | - | PK | 대여 고유 ID (형식: R-XXXXXXXXXXXXX) |
| user_id | VARCHAR(50) | NO | - | FK→users | 사용자 ID |
| bike_id | VARCHAR(15) | NO | - | FK→bikes | 자전거 ID |
| start_station_id | VARCHAR(10) | NO | - | FK→stations | 출발 대여소 ID |
| end_station_id | VARCHAR(10) | YES | NULL | FK→stations | 도착 대여소 ID (반납 시에만) |
| rental_time | TIMESTAMP | NO | - | - | 대여 시작 시간 |
| return_time | TIMESTAMP | YES | NULL | - | 반납 시간 |
| duration | INT UNSIGNED | YES | NULL | - | 이용 시간 (분 단위, 반납 시 계산) |
| distance | DECIMAL(6,2) | YES | NULL | - | 이동 거리 (km, 반납 시 계산) |
| status | ENUM | NO | 'rented' | - | 대여 상태 (rented, returned) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 레코드 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE | 마지막 수정 시간 |

#### 인덱스

- **PRIMARY KEY**: `id`
- **KEY**: `idx_rentals_user` (user_id) - 사용자별 대여 이력 조회
- **KEY**: `idx_rentals_bike` (bike_id) - 자전거별 대여 이력
- **KEY**: `idx_rentals_start_station` (start_station_id)
- **KEY**: `idx_rentals_end_station` (end_station_id)
- **KEY**: `idx_rentals_status` (status)
- **KEY**: `idx_rentals_rental_time` (rental_time) - 시간대별 통계
- **KEY**: `idx_rentals_return_time` (return_time)

#### 외래 키

- **fk_rentals_user**: `user_id` → `users(id)`
  - ON DELETE: CASCADE (사용자 삭제 시 대여 기록도 삭제)
  - ON UPDATE: CASCADE

- **fk_rentals_bike**: `bike_id` → `bikes(id)`
  - ON DELETE: RESTRICT (대여 기록이 있는 자전거는 삭제 불가)
  - ON UPDATE: CASCADE

- **fk_rentals_start_station**: `start_station_id` → `stations(id)`
  - ON DELETE: RESTRICT (대여 기록이 있는 대여소는 삭제 불가)
  - ON UPDATE: CASCADE

- **fk_rentals_end_station**: `end_station_id` → `stations(id)`
  - ON DELETE: RESTRICT
  - ON UPDATE: CASCADE

#### 비즈니스 규칙

- `id`는 "R-" + 타임스탬프 형식을 따릅니다 (예: R-1699999999999)
- 사용자는 한 번에 하나의 자전거만 대여할 수 있습니다
- `status='rented'`일 때는 `end_station_id`, `return_time`, `duration`, `distance`가 NULL입니다
- 반납 시 `duration`은 (return_time - rental_time)을 분 단위로 계산합니다
- `distance`는 출발 대여소와 도착 대여소 간의 직선거리를 계산합니다
- 관리자(`role='admin'`)는 자전거를 대여할 수 없습니다

#### 트랜잭션 시나리오

**대여 (Rental Creation)**
```sql
1. bikes 테이블에서 자전거 상태를 'rented'로 변경
2. bikes.current_station_id를 NULL로 설정
3. stations.bike_count를 1 감소
4. rentals 레코드 생성 (status='rented')
```

**반납 (Rental Return)**
```sql
1. bikes 테이블에서 자전거 상태를 'available'로 변경
2. bikes.current_station_id를 반납 대여소 ID로 설정
3. stations.bike_count를 1 증가
4. rentals 레코드 업데이트 (status='returned', end_station_id, return_time, duration, distance)
```

---

### 5. posts

**설명**: 커뮤니티 게시판 게시글

**테이블명**: `posts`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | VARCHAR(20) | NO | - | PK | 게시글 고유 ID (형식: P-XXXXXXXXXXXXX) |
| author_id | VARCHAR(50) | NO | - | FK→users | 작성자 ID |
| author_name | VARCHAR(100) | NO | - | - | 작성자 이름 (스냅샷) |
| category | ENUM | NO | - | - | 게시글 카테고리 |
| title | VARCHAR(500) | NO | - | - | 게시글 제목 |
| content | TEXT | NO | - | - | 게시글 내용 |
| views | INT UNSIGNED | NO | 0 | - | 조회수 |
| likes | INT UNSIGNED | NO | 0 | - | 좋아요 수 |
| comment_count | INT UNSIGNED | NO | 0 | - | 댓글 수 |
| is_pinned | BOOLEAN | NO | FALSE | - | 공지사항 고정 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 작성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE | 마지막 수정 시간 |

#### ENUM 값

- **category**: 'notice' (공지), 'info' (정보), 'question' (질문), 'free' (자유)

#### 인덱스

- **PRIMARY KEY**: `id`
- **KEY**: `idx_posts_author` (author_id)
- **KEY**: `idx_posts_category` (category) - 카테고리별 필터링
- **KEY**: `idx_posts_created_at` (created_at) - 최신순 정렬
- **KEY**: `idx_posts_is_pinned` (is_pinned) - 공지 우선 표시
- **KEY**: `idx_posts_views` (views) - 인기글 정렬
- **FULLTEXT KEY**: `ft_posts_title_content` (title, content) - 전체 텍스트 검색

#### 외래 키

- **fk_posts_author**: `author_id` → `users(id)`
  - ON DELETE: CASCADE (작성자 삭제 시 게시글도 삭제)
  - ON UPDATE: CASCADE

#### 비즈니스 규칙

- `id`는 "P-" + 타임스탬프 형식을 따릅니다
- `author_name`은 작성 시점의 사용자 이름을 저장합니다 (스냅샷)
- 게시글 조회 시 `views`가 자동으로 1 증가합니다
- `is_pinned=TRUE`인 게시글은 목록 상단에 고정됩니다
- 작성자 본인만 게시글을 수정할 수 있습니다
- 작성자 또는 관리자만 게시글을 삭제할 수 있습니다
- 전체 텍스트 검색은 `title`과 `content`를 대상으로 합니다

---

### 6. repairs

**설명**: 자전거 및 대여소 고장 신고

**테이블명**: `repairs`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | VARCHAR(20) | NO | - | PK | 신고 고유 ID (형식: REP-XXXXXXXXXXXXX) |
| reporter_id | VARCHAR(50) | NO | - | FK→users | 신고자 ID |
| reporter_name | VARCHAR(100) | NO | - | - | 신고자 이름 (스냅샷) |
| type | ENUM | NO | - | - | 신고 대상 (bike, station) |
| bike_id | VARCHAR(15) | YES | NULL | FK→bikes | 자전거 ID (type='bike'일 때) |
| station_id | VARCHAR(10) | YES | NULL | FK→stations | 대여소 ID (type='station'일 때) |
| category | ENUM | NO | - | - | 고장 카테고리 |
| description | TEXT | NO | - | - | 고장 상세 설명 |
| status | ENUM | NO | 'pending' | - | 처리 상태 |
| admin_note | TEXT | YES | NULL | - | 관리자 메모 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 신고 접수 시간 |
| completed_at | TIMESTAMP | YES | NULL | - | 처리 완료 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | ON UPDATE | 마지막 수정 시간 |

#### ENUM 값

- **type**: 'bike' (자전거), 'station' (대여소)
- **category**: 'brake' (브레이크), 'tire' (타이어), 'chain' (체인), 'light' (조명), 'seat' (안장), 'bell' (벨), 'other' (기타)
- **status**: 'pending' (대기 중), 'in-progress' (처리 중), 'completed' (완료)

#### 인덱스

- **PRIMARY KEY**: `id`
- **KEY**: `idx_repairs_reporter` (reporter_id)
- **KEY**: `idx_repairs_type` (type)
- **KEY**: `idx_repairs_bike` (bike_id)
- **KEY**: `idx_repairs_station` (station_id)
- **KEY**: `idx_repairs_status` (status) - 처리 상태별 조회
- **KEY**: `idx_repairs_created_at` (created_at)
- **KEY**: `idx_repairs_category` (category)

#### 외래 키

- **fk_repairs_reporter**: `reporter_id` → `users(id)`
  - ON DELETE: CASCADE
  - ON UPDATE: CASCADE

- **fk_repairs_bike**: `bike_id` → `bikes(id)`
  - ON DELETE: CASCADE
  - ON UPDATE: CASCADE

- **fk_repairs_station**: `station_id` → `stations(id)`
  - ON DELETE: CASCADE
  - ON UPDATE: CASCADE

#### 제약 조건 (CHECK)

```sql
CHECK (
  (type = 'bike' AND bike_id IS NOT NULL AND station_id IS NULL) OR
  (type = 'station' AND station_id IS NOT NULL AND bike_id IS NULL)
)
```

- `type='bike'`일 때는 `bike_id`만 입력, `station_id`는 NULL
- `type='station'`일 때는 `station_id`만 입력, `bike_id`는 NULL

#### 비즈니스 규칙

- `id`는 "REP-" + 타임스탬프 형식을 따릅니다
- `reporter_name`은 신고 시점의 사용자 이름을 저장합니다
- 관리자만 `status`를 변경하고 `admin_note`를 작성할 수 있습니다
- `status='completed'`로 변경 시 `completed_at`이 자동으로 설정됩니다
- 자전거 고장 신고 시 해당 자전거는 'maintenance' 상태로 변경됩니다

---

### 7. routes

**설명**: 사용자 경로 검색 이력 (선택 사항)

**테이블명**: `routes`

#### 컬럼 정의

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 제약조건 | 설명 |
|--------|------------|------|--------|----------|------|
| id | BIGINT UNSIGNED | NO | AUTO_INCREMENT | PK | 경로 ID |
| user_id | VARCHAR(50) | YES | NULL | FK→users | 사용자 ID (비로그인 시 NULL) |
| start_station_id | VARCHAR(10) | NO | - | FK→stations | 출발 대여소 ID |
| end_station_id | VARCHAR(10) | NO | - | FK→stations | 도착 대여소 ID |
| distance | DECIMAL(6,2) | NO | - | - | 자전거 이동 거리 (km) |
| duration | INT UNSIGNED | NO | - | - | 예상 소요 시간 (분) |
| walking_distance_to_start | DECIMAL(5,2) | NO | - | - | 출발지→출발 대여소 도보 거리 (km) |
| walking_distance_from_end | DECIMAL(5,2) | NO | - | - | 도착 대여소→목적지 도보 거리 (km) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 경로 검색 시간 |

#### 인덱스

- **PRIMARY KEY**: `id`
- **KEY**: `idx_routes_user` (user_id)
- **KEY**: `idx_routes_start_station` (start_station_id)
- **KEY**: `idx_routes_end_station` (end_station_id)
- **KEY**: `idx_routes_created_at` (created_at)

#### 외래 키

- **fk_routes_user**: `user_id` → `users(id)`
  - ON DELETE: SET NULL (사용자 삭제 시 NULL 처리)
  - ON UPDATE: CASCADE

- **fk_routes_start_station**: `start_station_id` → `stations(id)`
  - ON DELETE: CASCADE
  - ON UPDATE: CASCADE

- **fk_routes_end_station**: `end_station_id` → `stations(id)`
  - ON DELETE: CASCADE
  - ON UPDATE: CASCADE

#### 비즈니스 규칙

- 비로그인 사용자의 경로 검색도 기록됩니다 (`user_id=NULL`)
- `distance`는 대여소 간 직선거리 또는 API 기반 실제 거리입니다
- `duration`은 평균 속도(12km/h)를 기준으로 계산됩니다
- 경로 검색 이력은 통계 및 추천 시스템에 활용될 수 있습니다

---

## 인덱싱 전략

### 1. 기본 키 (Primary Key)

모든 테이블은 고유한 기본 키를 가집니다:
- `users.id`
- `stations.id`
- `bikes.id`
- `rentals.id`
- `posts.id`
- `repairs.id`
- `routes.id` (AUTO_INCREMENT)

### 2. 외래 키 인덱스

모든 외래 키 컬럼에 자동으로 인덱스가 생성됩니다:
- JOIN 성능 최적화
- 참조 무결성 검사 속도 향상

### 3. 조회 최적화 인덱스

#### users 테이블
- `email`: 로그인 시 빠른 조회 (UNIQUE)
- `role`, `status`: WHERE 절 필터링

#### stations 테이블
- `(latitude, longitude)`: 복합 인덱스로 공간 검색 최적화
- `bike_count`: 자전거 재고 조회
- `name`: 대여소명 검색

#### rentals 테이블
- `user_id`: 사용자별 대여 이력 조회
- `rental_time`, `return_time`: 시간대별 통계
- `status`: 대여 중인 자전거 조회

#### posts 테이블
- `category`: 카테고리별 필터링
- `created_at`: 최신순/날짜별 정렬
- `is_pinned`: 공지사항 우선 표시
- FULLTEXT `(title, content)`: 전체 텍스트 검색

### 4. 성능 고려사항

- **복합 인덱스 순서**: 카디널리티가 높은 컬럼을 앞에 배치
- **커버링 인덱스**: SELECT 절의 모든 컬럼이 인덱스에 포함되도록 설계
- **인덱스 크기**: VARCHAR는 prefix 인덱스 고려 (예: `name(50)`)
- **통계 갱신**: 주기적으로 `ANALYZE TABLE` 실행

---

## 외래 키 정책

### CASCADE 정책

**ON DELETE CASCADE**: 부모 레코드 삭제 시 자식 레코드도 자동 삭제

사용 사례:
- `rentals.user_id` → `users(id)`: 사용자 삭제 시 대여 기록도 삭제
- `posts.author_id` → `users(id)`: 작성자 삭제 시 게시글도 삭제
- `repairs.reporter_id` → `users(id)`: 신고자 삭제 시 신고 내역도 삭제
- `repairs.bike_id` → `bikes(id)`: 자전거 삭제 시 고장 신고도 삭제

### SET NULL 정책

**ON DELETE SET NULL**: 부모 레코드 삭제 시 자식의 외래 키를 NULL로 설정

사용 사례:
- `bikes.current_station_id` → `stations(id)`: 대여소 삭제 시 자전거 위치를 NULL로
- `routes.user_id` → `users(id)`: 사용자 삭제 시 경로 이력은 유지 (익명화)

### RESTRICT 정책

**ON DELETE RESTRICT**: 자식 레코드가 있으면 부모 레코드 삭제 불가

사용 사례:
- `rentals.bike_id` → `bikes(id)`: 대여 기록이 있는 자전거는 삭제 불가
- `rentals.start_station_id` → `stations(id)`: 대여 기록이 있는 대여소는 삭제 불가
- `rentals.end_station_id` → `stations(id)`: 반납 기록이 있는 대여소는 삭제 불가

### UPDATE CASCADE

**ON UPDATE CASCADE**: 부모 키 변경 시 자식 키도 자동 변경

모든 외래 키에 적용되어 참조 무결성을 유지합니다.

---

## 비즈니스 규칙

### 1. 사용자 인증

- 비밀번호는 bcrypt로 해시되어 저장 (비용 인자: 10)
- 이메일은 고유하며 대소문자 구분 없음
- 관리자는 `email='admin@test.com'`으로 식별
- 차단된 사용자(`status='blocked'`)는 로그인 불가

### 2. 자전거 대여

- 사용자는 한 번에 하나의 자전거만 대여 가능
- 관리자는 자전거 대여 불가
- `bikes.status='available'`이고 `stations.bike_count > 0`일 때만 대여 가능
- 대여 시 트랜잭션 처리:
  1. 자전거 상태를 'rented'로 변경
  2. 자전거의 `current_station_id`를 NULL로 설정
  3. 대여소 `bike_count` 감소
  4. `rentals` 레코드 생성

### 3. 자전거 반납

- 반납 시 트랜잭션 처리:
  1. 자전거 상태를 'available'로 변경
  2. 자전거의 `current_station_id` 설정
  3. 대여소 `bike_count` 증가
  4. `rentals` 레코드 업데이트 (duration, distance 계산)
- `duration` = (return_time - rental_time) 분 단위
- `distance` = Haversine 공식으로 계산된 대여소 간 거리

### 4. 게시판

- 로그인한 사용자만 게시글 작성 가능
- 작성자 본인만 게시글 수정 가능
- 작성자 또는 관리자만 게시글 삭제 가능
- 게시글 조회 시 `views` 자동 증가
- `is_pinned=TRUE` 게시글은 상단 고정 표시

### 5. 고장 신고

- 로그인한 사용자만 신고 가능
- `type='bike'`일 때는 `bike_id` 필수, `station_id` NULL
- `type='station'`일 때는 `station_id` 필수, `bike_id` NULL
- 관리자만 신고 상태 변경 및 `admin_note` 작성 가능
- 자전거 고장 신고 시 해당 자전거는 'maintenance' 상태로 변경

### 6. 데이터 무결성

- 모든 TIMESTAMP는 UTC 기준으로 저장
- ENUM 타입으로 허용된 값만 입력 가능
- CHECK 제약조건으로 비즈니스 규칙 강제
- 외래 키로 참조 무결성 보장

---

## 마이그레이션 및 유지보수

### 초기 설정

```bash
# 데이터베이스 생성 및 스키마 적용
mysql -u root -p < schema.sql

# 또는
mysql -u root -p
source /path/to/schema.sql
```

### 백업

```bash
# 전체 데이터베이스 백업
mysqldump -u root -p seoul_bike_sharing > backup_$(date +%Y%m%d).sql

# 특정 테이블만 백업
mysqldump -u root -p seoul_bike_sharing users rentals > backup_critical.sql
```

### 인덱스 최적화

```sql
-- 인덱스 통계 갱신
ANALYZE TABLE users, stations, bikes, rentals, posts, repairs;

-- 인덱스 사용 현황 확인
SHOW INDEX FROM rentals;

-- 쿼리 성능 분석
EXPLAIN SELECT * FROM rentals WHERE user_id = '2' AND status = 'rented';
```

### 모니터링

```sql
-- 테이블 크기 확인
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'seoul_bike_sharing'
ORDER BY size_mb DESC;

-- 느린 쿼리 로그 활성화
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

---

## 버전 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0.0 | 2025-11-15 | 초기 스키마 설계 | Seoul Bike Team |

---

**문서 끝**
