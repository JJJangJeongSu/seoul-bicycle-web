# Seoul Bicycle Web - API Integration TODO

## 🎯 Project Goal
실제 API 연동을 위한 체계적인 마이그레이션 및 Mock 모드 토글 구현

---

## 📋 Phase 1: 기반 구조 구축 ✅

### 1.1 Mock 모드 토글 시스템
- [x] ApiModeContext 생성 (`src/contexts/ApiModeContext.tsx`)
  - useMockMode 상태 관리
  - localStorage 기반 설정 저장/복원
  - toggleMockMode 함수
- [x] Navbar에 Mock 모드 토글 UI 추가
  - 개발 환경에서만 표시 (import.meta.env.DEV)
  - Switch 컴포넌트 사용
  - 🔧 Mock / 🌐 API 모드 표시
- [x] main.tsx에 ApiModeProvider 적용

### 1.2 Service Layer 구조
- [x] 디렉토리 구조 생성
  ```
  src/services/
  ├── api/
  │   ├── client.ts       # Axios 인스턴스
  │   ├── config.ts       # API 설정
  │   └── index.ts
  ├── auth.service.ts
  ├── station.service.ts
  ├── rental.service.ts
  ├── board.service.ts
  ├── repair.service.ts
  ├── admin.service.ts
  └── mock.service.ts
  ```
- [x] API 클라이언트 기본 설정 (client.ts)
  - Axios 인스턴스 생성
  - Request/Response 인터셉터
  - 에러 핸들링
- [x] CodeGenerator Configuration 통합

### 1.3 환경 변수 설정
- [x] `.env.example` 파일 생성
- [x] `.env.local` 파일 생성 (gitignore)
- [x] API Base URL 설정

---

## 📋 Phase 2: CodeGenerator 통합 ✅

### 2.1 API 서비스 구현
- [x] **AuthService** (우선순위: 높음)
  - login()
  - signup()
  - logout()
  - checkEmailAvailability()
  - Mock 모드 대응

- [x] **StationService** (우선순위: 높음)
  - getAllStations()
  - getStationById()
  - getNearestStation()
  - getStationsStatus()
  - Mock 모드 대응

- [x] **RentalService**
  - createRental()
  - returnRental()
  - getUserRentals()
  - Mock 모드 대응

- [x] **BoardService**
  - getAllPosts()
  - getPostById()
  - createPost()
  - updatePost()
  - deletePost()
  - Mock 모드 대응

- [x] **RepairService**
  - createRepair()
  - getMyRepairs()
  - getAllRepairs() (Admin)
  - updateRepairStatus() (Admin)
  - Mock 모드 대응

- [x] **AdminService**
  - getStatistics()
  - getAllUsers()
  - updateUserStatus()
  - Mock 모드 대응

- [x] **UserService**
  - getUserStatistics()
  - Mock 모드 대응

### 2.2 Mock Service 구현
- [x] mockData.ts를 기반으로 Mock Service 구현
- [x] 각 API 메서드와 동일한 인터페이스 제공
- [x] 지연 시뮬레이션 (setTimeout으로 실제 API처럼)

---

## 📋 Phase 3: Context & Hooks 개선 ✅

### 3.1 새로운 Context 생성
- [x] ApiModeContext (Mock/Real 모드 전환)
- [ ] StationContext (선택사항 - 현재 컴포넌트 레벨에서 처리)
- [ ] BoardContext (선택사항)
- [ ] RepairContext (선택사항)

### 3.2 Custom Hooks
- [x] useServices Hook ⭐
  - 모든 서비스에 대한 통합 접근
  - ApiModeContext 자동 연동
  - Memoization으로 성능 최적화
- [ ] useAsync Hook (선택사항 - 필요시 추가)
  - loading, error, data 상태 관리
  - 재시도 로직

---

## 📋 Phase 4: 페이지/컴포넌트 마이그레이션 🚧

### 4.1 우선순위 높음 ✅
- [x] **HomePage** 마이그레이션 ⭐
  - mockStations import 제거
  - StationService 사용
  - 로딩/에러 상태 처리
  - handleRent/handleReturn을 async로 변경
  - RentalService 통합
- [x] **AuthContext** 개선 ⭐
  - AuthService 연동
  - 토큰 관리
  - 로그인 상태 유지
  - LoginModal/SignupModal async 지원

### 4.2 우선순위 중간 (TODO - 필요시 진행)
- [ ] **MyPage** 마이그레이션
  - RentalHistory → RentalService
  - UserStats → UserService
- [ ] **BoardPage** 마이그레이션
  - BoardList → BoardService
  - PostDetail → BoardService
- [ ] **RepairPage** 마이그레이션
  - RepairList → RepairService
  - RepairForm → RepairService

### 4.3 우선순위 낮음 (TODO - 필요시 진행)
- [ ] **AdminPage** 마이그레이션
  - AdminDashboard → AdminService
  - AdminUsers → AdminService
  - AdminStations → StationService
  - AdminBikes → AdminService
  - AdminRepairs → RepairService

---

## 📋 Phase 5: 에러 핸들링 & UX 개선

### 5.1 에러 핸들링
- [ ] 공통 에러 핸들러 (`src/services/api/errorHandler.ts`)
  - 401: 자동 로그아웃
  - 403: 권한 오류 메시지
  - 404: 리소스 없음
  - 500: 서버 오류
- [ ] Toast/Alert 컴포넌트 통합
- [ ] 에러 바운더리 개선

### 5.2 로딩 상태
- [ ] 전역 로딩 인디케이터
- [ ] Skeleton UI 컴포넌트
- [ ] 각 페이지별 로딩 상태

### 5.3 성능 최적화
- [ ] React Query 도입 검토
- [ ] 캐싱 전략
- [ ] 무한 스크롤 / 페이지네이션

---

## 🗺️ Phase 6: 추후 기능 (TODO 마커)

### 6.1 지도 연동
- [ ] 지도 API 선택 (Kakao Maps / Naver Maps / Google Maps)
- [ ] `RoutePage.tsx` - 실시간 경로 안내
  - 현재 위치 추적
  - 경로 그리기
  - 마커 표시
  - 실시간 교통 정보
- [ ] `HomePage.tsx` - 지도 뷰 개선
  - 실제 지도 API 사용
  - 클러스터링
  - 실시간 자전거 현황

### 6.2 AI 코스 추천
- [ ] `AICourseRecommendPage.tsx` - AI 추천 기능
  - 사용자 선호도 분석
  - 날씨 정보 통합
  - 실시간 교통량 고려
  - 경로 최적화 알고리즘
- [ ] AI API 엔드포인트 연동
- [ ] 추천 결과 시각화

### 6.3 환경 변수 설정
```bash
# .env.example에 추가
# Map API Keys
VITE_KAKAO_MAP_KEY=your_key_here
VITE_NAVER_MAP_CLIENT_ID=your_id_here
VITE_GOOGLE_MAP_KEY=your_key_here

# AI Service
VITE_AI_SERVICE_URL=http://localhost:5000
```

---

## 📝 코드 마커 위치

### 지도 관련 TODO
```typescript
// src/components/pages/RoutePage.tsx:10
// TODO: 실제 지도 API 연동 필요
// - Kakao Maps / Naver Maps / Google Maps 중 선택
// - 현재 위치 추적 기능
// - 실시간 경로 그리기
// - 정류소 마커 표시

// src/components/home/MapView.tsx:15
// TODO: Mock 지도를 실제 지도 API로 교체
// - 클러스터링 구현
// - 실시간 자전거 현황 업데이트
```

### AI 추천 관련 TODO
```typescript
// src/components/pages/AICourseRecommendPage.tsx:20
// TODO: AI 코스 추천 API 연동
// - 사용자 선호도 기반 추천 알고리즘
// - 날씨 API 통합 (OpenWeatherMap)
// - 실시간 교통량 데이터 활용
// - 경로 최적화

// src/services/ai.service.ts
// TODO: AI Service 구현
// - recommendCourse()
// - getCoursePreferences()
// - updatePreferences()
```

---

## 🎯 구현 일정 (예상)

### Week 1: 기반 구축
- **Day 1-2**: Phase 1 완료 (Mock 토글 + Service Layer)
- **Day 3-4**: Phase 2 시작 (AuthService, StationService)
- **Day 5**: HomePage 마이그레이션 + 테스트

### Week 2: 핵심 기능
- **Day 1-2**: RentalService, BoardService, RepairService
- **Day 3-4**: MyPage, BoardPage, RepairPage 마이그레이션
- **Day 5**: 통합 테스트 & 버그 수정

### Week 3: 관리자 & 최적화
- **Day 1-2**: AdminService + AdminPage 마이그레이션
- **Day 3-4**: 에러 핸들링 & UX 개선
- **Day 5**: 성능 최적화 & 문서화

### Week 4+: 추가 기능
- 지도 연동
- AI 코스 추천
- 고급 기능

---

## ✅ 완료 기준

### Phase 1
- [x] CodeGenerator 폴더 통합
- [ ] Mock 모드 토글이 정상 동작
- [ ] Service Layer 기본 구조 완성
- [ ] 개발 환경 설정 완료

### Phase 2-3
- [ ] 모든 API 서비스 구현 완료
- [ ] Mock/Real 모드 전환이 seamless하게 동작
- [ ] 타입 안정성 보장

### Phase 4
- [ ] 모든 페이지가 Service Layer 사용
- [ ] mockData 직접 import 제거
- [ ] 로딩/에러 상태 처리 완료

### Phase 5
- [ ] 에러 핸들링 완료
- [ ] UX 개선 완료
- [ ] 성능 최적화 완료

---

## 📚 참고 문서

- [OpenAPI Spec](./openapi-spec.json)
- [CodeGenerator API Docs](./CodeGenerator/docs/)
- [CLAUDE.md](./CLAUDE.md) - 프로젝트 가이드라인
- [Figma Design](https://www.figma.com/design/aJfOnTQZwtUneqKjGGYkcj/Simulation-Platform-Design)

---

## ✅ 완료 요약 (2024-11-16)

### 핵심 성과
1. **✅ Mock/API 모드 토글 시스템 완성**
   - ApiModeContext 구현
   - Navbar UI 통합
   - localStorage 기반 상태 저장

2. **✅ 완전한 Service Layer 구축**
   - 7개 서비스 클래스 (Auth, Station, Rental, Board, Repair, Admin, User)
   - Mock Service 완전 구현
   - Real API Service 구조 완성
   - useServices Hook 제공

3. **✅ HomePage 완전 마이그레이션**
   - StationService 사용
   - RentalService 통합
   - 로딩/에러 상태 처리
   - Async operations

4. **✅ AuthContext 완전 마이그레이션**
   - AuthService 사용
   - Token 관리
   - LoginModal/SignupModal async 지원

### 기술 스택
- **Service Layer**: Axios, TypeScript
- **State Management**: React Context API
- **API Client**: Auto-generated from OpenAPI spec
- **Mock/Real Switching**: Factory Pattern

### 프로젝트 상태
- **완료**: Phase 1, 2, 3, 4.1
- **남은 작업**: Phase 4.2, 4.3 (선택사항), Phase 5, 6
- **다음 단계**: 나머지 페이지 마이그레이션 (필요시)

---

## 🔄 변경 이력

- 2024-11-16: 초기 TODO 문서 작성
- 2024-11-16: CodeGenerator 통합 완료
- 2024-11-16: Phase 1-4.1 완료 (Service Layer + HomePage + Auth 마이그레이션)
