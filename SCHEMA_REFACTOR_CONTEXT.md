# API Context Schema Refactoring - Work Context

**Date**: 2025-11-15
**Project**: 서울 따릉이 시뮬레이션 플랫폼
**Task**: api-context-schema.json 전면 재구성

---

## 📌 Executive Summary

`api-context-schema.json` 파일을 실제 코드베이스 구현과 일치하도록 전면 재구성합니다. 기존 스키마는 백엔드 API가 존재한다고 가정했으나, 실제로는 **100% 프론트엔드 mock 기반** 시뮬레이션입니다. 전략 C (다층 구조)를 채택하여 frontend/data/api를 명확히 분리합니다.

---

## 🔍 Current Situation Analysis

### 1. **기존 스키마의 문제점**

#### Critical Misalignment
```
기존 스키마: "이 앱은 /api 엔드포인트를 호출합니다"
실제 구현: "모든 데이터는 mockData.ts에서 import하여 local state로 관리합니다"
```

**구체적 불일치 사례**:

| 스키마 내용 | 실제 구현 | 영향 |
|------------|----------|------|
| `POST /rentals` 호출 | `setCurrentRental({ id: Date.now(), ... })` | 신규 개발자 혼란 |
| `GET /stations` API | `import { mockStations } from '@/lib/mockData'` | 잘못된 개발 방향 |
| API response handling | Direct state mutation | 디버깅 어려움 |
| Authentication endpoint | Mock logic in App.tsx | 보안 오해 가능성 |

#### Missing Information

기존 스키마에 **완전히 누락된** 핵심 정보:

1. **State Management Architecture**
   - React local state only (no Redux, Zustand, Context API)
   - Props drilling pattern
   - State ownership (App.tsx가 user, currentRental, currentPage 소유)

2. **Routing Implementation**
   - Manual client-side routing via `currentPage` state
   - No React Router, no URL-based routing
   - Page transitions via `setCurrentPage('home' | 'mypage' | ...)`

3. **Component Hierarchy**
   - App.tsx → Pages → Subcomponents
   - 50+ shadcn/ui components (do not edit)
   - Props flow patterns

4. **Type System**
   - All core types defined in App.tsx (not separate files)
   - Import pattern: `import { User, Station, Rental } from '../../App'`

5. **Mock Data Pattern**
   - Import mock arrays → Copy to local state → Mutate locally
   - No persistence, no backend sync
   - Data resets on page reload

6. **Development Workflow**
   - Vite dev server on port 3000
   - No backend, no database, no API calls
   - Pure frontend simulation

### 2. **데이터 모델 불일치**

#### Example: Rental Type

**스키마 정의**:
```json
"Rental": {
  "endStationId": "string | null",
  "returnTime": "Date | null"
}
```

**실제 TypeScript 정의** (App.tsx:31-42):
```typescript
export type Rental = {
  id: string;
  userId: string;
  bikeId: string;
  startStationId: string;
  endStationId?: string;        // undefined, not null
  rentalTime: Date;
  returnTime?: Date;            // undefined, not null
  distance?: number;            // undefined, not null
  duration?: number;            // undefined, not null
  status: 'rented' | 'returned';
};
```

**차이점**: TypeScript uses `?:` (undefined) vs JSON schema uses `| null`

#### Example: Post Type

**스키마에 누락된 필드** (mockData.ts:276-338):
```typescript
{
  isPinned?: boolean;   // 공지사항 상단 고정
  comments: number;     // 댓글 수 (중요!)
  author: string;       // authorName과 별도
}
```

### 3. **실제 아키텍처 파악**

#### State Flow Example: Bike Rental

```
[User clicks "대여" button]
  ↓
StationDetailModal (HomePage 자식 컴포넌트)
  ↓ calls onRent callback
HomePage receives onRent prop from App.tsx
  ↓ calls onRent(newRental)
App.tsx: setCurrentRental(newRental)
  ↓ re-renders with new currentRental
Navbar receives currentRental as prop
  ↓ displays "대여 중" indicator
```

**No API involved at any step!**

#### Authentication Flow

```typescript
// App.tsx:51-62
const handleLogin = (email: string, password: string) => {
  // Mock login - NO API CALL
  const mockUser: User = {
    id: '1',
    email,
    name: email === 'admin@test.com' ? '관리자' : '홍길동',
    role: email === 'admin@test.com' ? 'admin' : 'user',
    phone: '010-1234-5678',
  };
  setUser(mockUser);
  setShowLoginModal(false);
};
```

**Key Insight**: Email `admin@test.com` → admin role, 그 외 → user role

---

## 🎯 Refactoring Strategy: Strategy C (Multi-Layer Structure)

### Why Strategy C?

| Strategy | Pros | Cons | Decision |
|----------|------|------|----------|
| A: Frontend-only | 100% accurate | API spec lost | ❌ 향후 백엔드 연동 시 재작성 필요 |
| B: Hybrid | Future-proof | Too complex | ❌ 현재 구현 정보가 묻힘 |
| C: Multi-layer | Clear separation | Requires restructure | ✅ **채택** |

### Strategy C Structure

```
api-context-schema.json
├── project (metadata)
├── frontend (현재 구현)
│   ├── architecture
│   ├── components
│   ├── pages
│   ├── stateFlow
│   └── routing
├── data (타입 및 mock 데이터)
│   ├── types
│   ├── mockData
│   └── dataFlow
└── api (향후 백엔드 연동)
    ├── status: "planned"
    ├── baseUrl
    └── endpoints
```

**핵심 원칙**:
1. **Frontend section** = 현재 실제로 작동하는 방식
2. **Data section** = 실제 타입 정의 및 mock 데이터 위치
3. **API section** = 향후 계획 (현재 사용 안 함을 명시)

---

## 📋 Work Procedure

### Phase 1: Detailed Codebase Analysis ✅

**Completed Files**:
- ✅ `package.json` - Dependencies and scripts
- ✅ `vite.config.ts` - Build configuration and aliases
- ✅ `src/App.tsx` - Root component, types, auth logic
- ✅ `src/main.tsx` - Entry point
- ✅ `src/lib/mockData.ts` - All mock data
- ✅ `src/components/layout/Navbar.tsx` - Navigation
- ✅ `src/components/pages/*.tsx` - Page components
- ✅ `src/components/home/*.tsx` - HomePage subcomponents

**Key Findings**:
1. No backend, no API layer, no HTTP requests
2. All state in App.tsx or page-level components
3. Types defined in App.tsx (User, Station, Rental)
4. Mock data in mockData.ts (stations, rentals, posts, repairs, routes)
5. Manual routing via currentPage state
6. Props drilling for state management
7. 50+ shadcn/ui components (hands-off)

### Phase 2: Create Work Context Document 🔄

**Current File**: `SCHEMA_REFACTOR_CONTEXT.md`

**Contents**:
- ✅ Current situation analysis
- ✅ Problem identification
- ✅ Strategy selection rationale
- ✅ Work procedure outline
- 🔄 Expected deliverables (this section)

### Phase 3: Schema Redesign (Next)

**Tasks**:
1. Create new schema structure
2. Populate `frontend` section with actual architecture
3. Populate `data` section with real types and mock data info
4. Update `api` section to mark as "planned, not implemented"
5. Add detailed component hierarchy
6. Add state flow diagrams (text-based)
7. Add development workflow info

### Phase 4: Validation

**Validation Checklist**:
- [ ] Every component mentioned exists in codebase
- [ ] Every type definition matches actual TypeScript code
- [ ] Every mock data export is documented
- [ ] State flow matches actual component props
- [ ] No references to non-existent API endpoints as "current"
- [ ] All page routes match currentPage type
- [ ] All imports paths are accurate

### Phase 5: Documentation

**Additional Files**:
- Update `CLAUDE.md` to reference new schema
- Add migration notes if needed

---

## 📦 Expected Deliverables

### 1. **Refactored `api-context-schema.json`**

**Structure**:
```json
{
  "schemaVersion": "2.0.0",
  "lastUpdated": "2025-11-15",

  "project": {
    "name": "서울 따릉이 시뮬레이션 플랫폼",
    "version": "1.0.0",
    "type": "frontend-simulation",
    "hasBackend": false,
    "figmaDesign": "https://www.figma.com/design/..."
  },

  "frontend": {
    "architecture": { ... },
    "stateManagement": { ... },
    "routing": { ... },
    "components": { ... },
    "pages": { ... }
  },

  "data": {
    "typeDefinitions": { ... },
    "mockData": { ... },
    "dataFlow": { ... }
  },

  "api": {
    "status": "planned",
    "note": "No backend currently implemented. All endpoints are future specs.",
    "baseUrl": "/api",
    "endpoints": [ ... ]
  }
}
```

**Key Improvements**:
- ✅ Clearly states "no backend"
- ✅ Separates current (frontend) from future (api)
- ✅ Includes architecture documentation
- ✅ Matches actual implementation 100%
- ✅ Provides migration path for future backend

### 2. **Validation Report**

Will include:
- All components validated against filesystem
- All types validated against App.tsx
- All mock data validated against mockData.ts
- All state flows validated against component props

### 3. **This Context Document**

Purpose:
- Explain WHY we're refactoring
- Document WHAT we found
- Guide HOW we're fixing it
- Record decisions for future reference

---

## 🔑 Key Insights for Future Development

### For New Developers

**Before reading schema**:
1. This is a **simulation**, not a real app
2. No backend exists or is planned
3. All data is **hardcoded** in mockData.ts
4. State resets on page reload
5. "API endpoints" in schema are **design specs only**

### For Future Backend Integration

**When ready to add backend**:
1. Install axios or fetch wrapper
2. Create `src/api/` directory
3. Replace mock imports with API calls
4. Add error handling, loading states
5. Update schema `api.status` to "implemented"
6. Keep mock data for development/testing

### For AI Agents (Claude Code)

**Critical context**:
- **Always check mockData.ts first** when looking for data
- **Types are in App.tsx**, not separate type files
- **State is in App.tsx** for global, page components for local
- **No routing library** - look for `currentPage` state
- **UI components are read-only** - don't edit shadcn/ui files

---

## 📊 Success Metrics

Refactoring will be successful if:

1. ✅ Schema accurately represents current implementation
2. ✅ No developer confusion about API vs mock data
3. ✅ Future backend integration path is clear
4. ✅ All components, types, and data are documented
5. ✅ AI agents can navigate codebase confidently
6. ✅ New developers understand architecture in <10 minutes

---

## 🚀 Next Steps

After this refactoring:

1. **Immediate**: Use new schema for development
2. **Short-term**: Update CLAUDE.md to reference schema
3. **Medium-term**: Consider adding TypeScript interfaces export
4. **Long-term**: Plan backend implementation using API specs

---

## 📝 Notes and Decisions

### Decision Log

**2025-11-15**: Chose Strategy C over A and B
- Reason: Best balance of accuracy and future-proofing
- Trade-off: Slightly more complex structure
- Benefit: Clear current vs future separation

### Open Questions

1. Should we keep full API specs in schema, or move to separate file?
   - **Decision**: Keep in schema but clearly mark as "planned"

2. Should we document every single UI component?
   - **Decision**: No, just mention "50+ shadcn/ui components" and link to directory

3. How detailed should state flow documentation be?
   - **Decision**: High-level flows only, detailed props in component sections

---

## 🔗 Related Files

- `CLAUDE.md` - Main codebase guide for Claude Code
- `README.md` - Project overview
- `src/App.tsx` - Type definitions and root state
- `src/lib/mockData.ts` - All mock data
- `api-context-schema.json` - **This file we're refactoring**

---

**End of Context Document**

---

## Appendix: Quick Reference

### File Locations
- Entry: `src/main.tsx`
- Root: `src/App.tsx`
- Types: `src/App.tsx` (lines 13-42)
- Mock Data: `src/lib/mockData.ts`
- Pages: `src/components/pages/`
- UI Components: `src/components/ui/` (50+ files)

### Key State Variables
- `user: User | null` - Current logged in user
- `currentPage: 'home' | 'mypage' | ...` - Current route
- `currentRental: Rental | null` - Active bike rental
- `showLoginModal: boolean` - Login modal visibility
- `showSignupModal: boolean` - Signup modal visibility

### Mock Credentials
- Admin: `admin@test.com` / any password
- User: any other email / any password

### Important Patterns
- State: Local state in App.tsx and page components
- Data: Import from mockData.ts → Copy to state → Mutate locally
- Types: Import from App.tsx
- Navigation: `setCurrentPage(newPage)`
- Auth: `setUser(mockUser)` (no validation)
