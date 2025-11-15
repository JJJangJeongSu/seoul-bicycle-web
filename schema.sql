-- =====================================================
-- Seoul Bike Sharing Platform Database Schema
-- =====================================================
-- Database: seoul_bike_sharing
-- Charset: utf8mb4 (supports Korean characters and emoji)
-- Collation: utf8mb4_unicode_ci
-- Engine: InnoDB (supports foreign keys and transactions)
-- =====================================================

-- Drop existing database and create fresh
DROP DATABASE IF EXISTS seoul_bike_sharing;
CREATE DATABASE seoul_bike_sharing
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE seoul_bike_sharing;

-- =====================================================
-- Table: users
-- Description: 사용자 계정 정보 (일반 사용자 및 관리자)
-- =====================================================
CREATE TABLE users (
  id VARCHAR(50) NOT NULL COMMENT '사용자 고유 ID',
  email VARCHAR(255) NOT NULL COMMENT '이메일 주소 (로그인 ID)',
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 해시된 비밀번호',
  name VARCHAR(100) NOT NULL COMMENT '사용자 이름',
  phone VARCHAR(20) NOT NULL COMMENT '전화번호 (형식: 010-XXXX-XXXX)',
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT '사용자 역할 (user: 일반 사용자, admin: 관리자)',
  status ENUM('active', 'blocked') NOT NULL DEFAULT 'active' COMMENT '계정 상태',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '계정 생성 시간',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_status (status),
  KEY idx_users_created_at (created_at)
) ENGINE=InnoDB COMMENT='사용자 계정 정보';

-- =====================================================
-- Table: stations
-- Description: 따릉이 대여소 정보
-- =====================================================
CREATE TABLE stations (
  id VARCHAR(10) NOT NULL COMMENT '대여소 고유 ID (형식: ST-XXX)',
  name VARCHAR(200) NOT NULL COMMENT '대여소 이름',
  address VARCHAR(500) NOT NULL COMMENT '대여소 주소',
  latitude DECIMAL(10, 7) NOT NULL COMMENT '위도',
  longitude DECIMAL(10, 7) NOT NULL COMMENT '경도',
  bike_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '현재 대여 가능한 자전거 수',
  capacity INT UNSIGNED NOT NULL COMMENT '대여소 최대 수용 대수',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '대여소 운영 상태',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '대여소 등록 시간',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

  PRIMARY KEY (id),
  KEY idx_stations_status (status),
  KEY idx_stations_location (latitude, longitude),
  KEY idx_stations_bike_count (bike_count),
  KEY idx_stations_name (name)
) ENGINE=InnoDB COMMENT='따릉이 대여소 정보';

-- =====================================================
-- Table: bikes
-- Description: 자전거 정보
-- =====================================================
CREATE TABLE bikes (
  id VARCHAR(15) NOT NULL COMMENT '자전거 고유 ID (형식: SPB-XXXXX)',
  current_station_id VARCHAR(10) NULL COMMENT '현재 위치한 대여소 ID (대여 중이면 NULL)',
  status ENUM('available', 'rented', 'maintenance', 'broken') NOT NULL DEFAULT 'available' COMMENT '자전거 상태',
  model VARCHAR(100) NULL COMMENT '자전거 모델명',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '자전거 등록 시간',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

  PRIMARY KEY (id),
  KEY idx_bikes_current_station (current_station_id),
  KEY idx_bikes_status (status),

  CONSTRAINT fk_bikes_station
    FOREIGN KEY (current_station_id)
    REFERENCES stations(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='자전거 정보';

-- =====================================================
-- Table: rentals
-- Description: 자전거 대여/반납 기록
-- =====================================================
CREATE TABLE rentals (
  id VARCHAR(20) NOT NULL COMMENT '대여 고유 ID (형식: R-XXXXXXXXXXXXX)',
  user_id VARCHAR(50) NOT NULL COMMENT '사용자 ID',
  bike_id VARCHAR(15) NOT NULL COMMENT '자전거 ID',
  start_station_id VARCHAR(10) NOT NULL COMMENT '출발 대여소 ID',
  end_station_id VARCHAR(10) NULL COMMENT '도착 대여소 ID (반납 시에만 입력)',
  rental_time TIMESTAMP NOT NULL COMMENT '대여 시작 시간',
  return_time TIMESTAMP NULL COMMENT '반납 시간',
  duration INT UNSIGNED NULL COMMENT '이용 시간 (분 단위, 반납 시 계산)',
  distance DECIMAL(6, 2) NULL COMMENT '이동 거리 (km, 반납 시 계산)',
  status ENUM('rented', 'returned') NOT NULL DEFAULT 'rented' COMMENT '대여 상태',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '레코드 생성 시간',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

  PRIMARY KEY (id),
  KEY idx_rentals_user (user_id),
  KEY idx_rentals_bike (bike_id),
  KEY idx_rentals_start_station (start_station_id),
  KEY idx_rentals_end_station (end_station_id),
  KEY idx_rentals_status (status),
  KEY idx_rentals_rental_time (rental_time),
  KEY idx_rentals_return_time (return_time),

  CONSTRAINT fk_rentals_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_rentals_bike
    FOREIGN KEY (bike_id)
    REFERENCES bikes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_rentals_start_station
    FOREIGN KEY (start_station_id)
    REFERENCES stations(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_rentals_end_station
    FOREIGN KEY (end_station_id)
    REFERENCES stations(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='자전거 대여/반납 기록';

-- =====================================================
-- Table: posts
-- Description: 커뮤니티 게시판 게시글
-- =====================================================
CREATE TABLE posts (
  id VARCHAR(20) NOT NULL COMMENT '게시글 고유 ID (형식: P-XXXXXXXXXXXXX)',
  author_id VARCHAR(50) NOT NULL COMMENT '작성자 ID',
  author_name VARCHAR(100) NOT NULL COMMENT '작성자 이름 (스냅샷)',
  category ENUM('notice', 'info', 'question', 'free') NOT NULL COMMENT '게시글 카테고리',
  title VARCHAR(500) NOT NULL COMMENT '게시글 제목',
  content TEXT NOT NULL COMMENT '게시글 내용',
  views INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '조회수',
  likes INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '좋아요 수',
  comment_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '댓글 수',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE COMMENT '공지사항 고정 여부',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성 시간',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

  PRIMARY KEY (id),
  KEY idx_posts_author (author_id),
  KEY idx_posts_category (category),
  KEY idx_posts_created_at (created_at),
  KEY idx_posts_is_pinned (is_pinned),
  KEY idx_posts_views (views),
  FULLTEXT KEY ft_posts_title_content (title, content),

  CONSTRAINT fk_posts_author
    FOREIGN KEY (author_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='커뮤니티 게시판 게시글';

-- =====================================================
-- Table: repairs
-- Description: 자전거 및 대여소 고장 신고
-- =====================================================
CREATE TABLE repairs (
  id VARCHAR(20) NOT NULL COMMENT '신고 고유 ID (형식: REP-XXXXXXXXXXXXX)',
  reporter_id VARCHAR(50) NOT NULL COMMENT '신고자 ID',
  reporter_name VARCHAR(100) NOT NULL COMMENT '신고자 이름 (스냅샷)',
  type ENUM('bike', 'station') NOT NULL COMMENT '신고 대상 (bike: 자전거, station: 대여소)',
  bike_id VARCHAR(15) NULL COMMENT '자전거 ID (type이 bike일 때)',
  station_id VARCHAR(10) NULL COMMENT '대여소 ID (type이 station일 때)',
  category ENUM('brake', 'tire', 'chain', 'light', 'seat', 'bell', 'other') NOT NULL COMMENT '고장 카테고리',
  description TEXT NOT NULL COMMENT '고장 상세 설명',
  status ENUM('pending', 'in-progress', 'completed') NOT NULL DEFAULT 'pending' COMMENT '처리 상태',
  admin_note TEXT NULL COMMENT '관리자 메모',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '신고 접수 시간',
  completed_at TIMESTAMP NULL COMMENT '처리 완료 시간',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정 시간',

  PRIMARY KEY (id),
  KEY idx_repairs_reporter (reporter_id),
  KEY idx_repairs_type (type),
  KEY idx_repairs_bike (bike_id),
  KEY idx_repairs_station (station_id),
  KEY idx_repairs_status (status),
  KEY idx_repairs_created_at (created_at),
  KEY idx_repairs_category (category),

  CONSTRAINT fk_repairs_reporter
    FOREIGN KEY (reporter_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_repairs_bike
    FOREIGN KEY (bike_id)
    REFERENCES bikes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_repairs_station
    FOREIGN KEY (station_id)
    REFERENCES stations(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_repairs_target
    CHECK (
      (type = 'bike' AND bike_id IS NOT NULL AND station_id IS NULL) OR
      (type = 'station' AND station_id IS NOT NULL AND bike_id IS NULL)
    )
) ENGINE=InnoDB COMMENT='자전거 및 대여소 고장 신고';

-- =====================================================
-- Table: routes
-- Description: 사용자 경로 검색 이력 (선택 사항)
-- =====================================================
CREATE TABLE routes (
  id BIGINT UNSIGNED AUTO_INCREMENT COMMENT '경로 ID',
  user_id VARCHAR(50) NULL COMMENT '사용자 ID (비로그인 사용자는 NULL)',
  start_station_id VARCHAR(10) NOT NULL COMMENT '출발 대여소 ID',
  end_station_id VARCHAR(10) NOT NULL COMMENT '도착 대여소 ID',
  distance DECIMAL(6, 2) NOT NULL COMMENT '자전거 이동 거리 (km)',
  duration INT UNSIGNED NOT NULL COMMENT '예상 소요 시간 (분)',
  walking_distance_to_start DECIMAL(5, 2) NOT NULL COMMENT '출발지에서 출발 대여소까지 도보 거리 (km)',
  walking_distance_from_end DECIMAL(5, 2) NOT NULL COMMENT '도착 대여소에서 목적지까지 도보 거리 (km)',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '경로 검색 시간',

  PRIMARY KEY (id),
  KEY idx_routes_user (user_id),
  KEY idx_routes_start_station (start_station_id),
  KEY idx_routes_end_station (end_station_id),
  KEY idx_routes_created_at (created_at),

  CONSTRAINT fk_routes_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_routes_start_station
    FOREIGN KEY (start_station_id)
    REFERENCES stations(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_routes_end_station
    FOREIGN KEY (end_station_id)
    REFERENCES stations(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='사용자 경로 검색 이력';

-- =====================================================
-- Insert sample data for development/testing
-- =====================================================

-- Sample admin user (email: admin@test.com, password: admin123)
INSERT INTO users (id, email, password_hash, name, phone, role) VALUES
('1', 'admin@test.com', '$2b$10$ZVxK8gKLvVvO0fy7gVJGXO0K0uM0cH3K0gH0K0H0K0H0K0H0K0H0K0', '관리자', '010-0000-0000', 'admin');

-- Sample regular user (email: user@test.com, password: user123)
INSERT INTO users (id, email, password_hash, name, phone, role) VALUES
('2', 'user@test.com', '$2b$10$ZVxK8gKLvVvO0fy7gVJGXO0K0uM0cH3K0gH0K0H0K0H0K0H0K0H0K0', '홍길동', '010-1234-5678', 'user');

-- Sample stations (강남역, 역삼역, 선릉역)
INSERT INTO stations (id, name, address, latitude, longitude, bike_count, capacity, status) VALUES
('ST-001', '강남역 1번출구', '서울특별시 강남구 강남대로 396', 37.497900, 127.027600, 12, 20, 'active'),
('ST-002', '역삼역 2번출구', '서울특별시 강남구 테헤란로 147', 37.500500, 127.036500, 8, 15, 'active'),
('ST-003', '선릉역 8번출구', '서울특별시 강남구 테헤란로 305', 37.504600, 127.049100, 15, 20, 'active');

-- Sample bikes
INSERT INTO bikes (id, current_station_id, status) VALUES
('SPB-00001', 'ST-001', 'available'),
('SPB-00002', 'ST-001', 'available'),
('SPB-00003', 'ST-002', 'available'),
('SPB-00004', 'ST-003', 'available');

-- =====================================================
-- End of Schema
-- =====================================================
