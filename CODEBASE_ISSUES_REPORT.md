# 코드베이스 문제점 분석 보고서

**분석 일자**: 2025-11-15
**총 파일 수**: 78개 TypeScript/React 파일
**발견된 문제**: 36+ 개 (High: 6, Medium: 18+, Low: 12+)

---

## 🚨 최우선 해결 과제 (HIGH SEVERITY)

### 1. 라우팅 시스템 문제 ⚠️

#### 현재 구현
```typescript
// src/App.tsx:45
const [currentPage, setCurrentPage] = useState<'home' | 'mypage' | ...>('home');

// 조건부 렌더링
{currentPage === 'home' && <HomePage ... />}
{currentPage === 'mypage' && <MyPage ... />}
```

#### 문제점
| 문제 | 영향 | 심각도 |
|------|------|--------|
| **URL이 변하지 않음** | 모든 페이지가 `/`로 표시 | 🔴 Critical |
| **뒤로가기/앞으로가기 불가** | 브라우저 네비게이션 버튼 작동 안 함 | 🔴 Critical |
| **URL 공유 불가능** | 특정 페이지 링크를 복사해서 보낼 수 없음 | 🔴 Critical |
| **북마크 불가능** | 사용자가 특정 페이지를 북마크할 수 없음 | 🟡 High |
| **페이지 새로고침 시 초기화** | F5 누르면 항상 홈으로 돌아감 | 🔴 Critical |
| **SEO 불가능** | 검색 엔진이 각 페이지를 인덱싱할 수 없음 | 🟡 High |
| **딥링킹 불가** | 게시글 상세 페이지 직접 링크 불가 | 🔴 Critical |

#### 해결 방안: React Router 도입

**설치**:
```bash
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

**구현 예시**:
```typescript
// src/main.tsx
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/mypage" element={
          user && user.role !== 'admin'
            ? <MyPage user={user} />
            : <Navigate to="/" replace />
        } />
        <Route path="/board" element={<BoardPage user={user} />} />
        <Route path="/board/:postId" element={<PostDetail user={user} />} />
        <Route path="/repair" element={<RepairPage user={user} />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/ai-course" element={<AICourseRecommendPage />} />
        <Route path="/admin/*" element={
          user?.role === 'admin'
            ? <AdminPage />
            : <Navigate to="/" replace />
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// src/components/layout/Navbar.tsx
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <button
      onClick={() => navigate('/board')}
      className={isActive('/board') ? 'active' : ''}
    >
      게시판
    </button>
  );
}
```

**예상 효과**:
- ✅ URL이 `/board`, `/mypage` 등으로 변경
- ✅ 뒤로가기/앞으로가기 정상 작동
- ✅ URL 복사해서 공유 가능
- ✅ 북마크 가능
- ✅ 새로고침 시 현재 페이지 유지
- ✅ 게시글 상세 링크: `/board/P-001`

---

### 2. 타입 안전성 문제 ⚠️

#### 발견된 `any` 타입 사용

| 파일 | 라인 | 코드 | 문제 |
|------|------|------|------|
| `App.tsx` | 64 | `handleSignup(data: any)` | 회원가입 데이터 타입 없음 |
| `PostDetail.tsx` | 13 | `useState<any>(null)` | 게시글 데이터 타입 없음 |
| `PostDetail.tsx` | 23, 179 | `posts.find((p: any) => ...)` | 배열 요소 타입 없음 |
| `AdminRepairs.tsx` | 29 | `parsedRepairs.map((r: any) => ...)` | Repair 타입 미사용 |

#### 안전하지 않은 타입 캐스팅

```typescript
// ❌ Bad - 9개 파일에서 발견
onClick={() => setActiveTab(tab.id as any)}
setSortBy(e.target.value as any)

// ✅ Good - 명시적 타입 정의
type TabId = 'history' | 'stats' | 'settings';
type SortBy = 'date' | 'distance' | 'duration';

const [activeTab, setActiveTab] = useState<TabId>('history');
const [sortBy, setSortBy] = useState<SortBy>('date');

onClick={() => setActiveTab(tab.id as TabId)}  // 타입 체크됨
```

#### 해결 방안: 타입 정의 파일 생성

```typescript
// src/types/index.ts
export type SignupData = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type Post = {
  id: string;
  category: 'notice' | 'info' | 'question' | 'free';
  title: string;
  content: string;
  author: string;
  authorId: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  isPinned?: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
};

// src/App.tsx
import { SignupData } from './types';

const handleSignup = (data: SignupData) => {
  // 이제 data.email, data.name 등이 자동완성됨
};
```

---

### 3. 클라이언트 사이드 인증 문제 🔐

#### 현재 구현 (심각한 보안 취약점)
```typescript
// src/App.tsx:51-62
const handleLogin = (email: string, password: string) => {
  // ❌ 모든 인증 로직이 클라이언트에만 있음!
  const mockUser: User = {
    id: '1',
    email,
    role: email === 'admin@test.com' ? 'admin' : 'user',  // 🚨 누구나 수정 가능
    phone: '010-1234-5678',
  };
  setUser(mockUser);  // 🚨 서버 검증 없음
};
```

#### 공격 시나리오
```javascript
// 브라우저 콘솔에서 실행:
const user = {
  id: '999',
  email: 'hacker@evil.com',
  role: 'admin',  // 🚨 관리자 권한 탈취!
  phone: '010-0000-0000'
};
localStorage.setItem('user', JSON.stringify(user));
// 새로고침하면 관리자 페이지 접근 가능
```

#### 해결 방안: 서버 인증 구현

**백엔드 필요 (Node.js + Express 예시)**:
```typescript
// Backend: POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. DB에서 사용자 조회
  const user = await db.users.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // 2. 비밀번호 검증
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  // 3. JWT 토큰 발급
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, email, name: user.name, role: user.role } });
});

// Frontend: src/lib/api.ts
export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');

  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  return user;
}

// Protected API 호출
export async function fetchProtectedData() {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // 토큰 만료 → 로그인 페이지로
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response.json();
}
```

---

### 4. Error Boundary 부재 🚫

#### 문제
```
현재: 한 컴포넌트에서 에러 발생 → 전체 앱 크래시 (흰 화면)
```

#### 해결 방안

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // 여기서 Sentry 등 에러 리포팅 서비스로 전송 가능
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// src/App.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={
          <ErrorBoundary fallback={<div>홈 로딩 실패</div>}>
            <HomePage />
          </ErrorBoundary>
        } />
        {/* 각 페이지마다 개별 ErrorBoundary로 감싸면
            특정 페이지 에러가 전체 앱을 죽이지 않음 */}
      </Routes>
    </ErrorBoundary>
  );
}
```

---

### 5. Props Drilling 문제 🔗

#### 현재 상황
```typescript
App.tsx (user state)
  ↓ props: user
Navbar.tsx
  ↓ (6 props 전달)
HomePage.tsx
  ↓ props: user, onRent
StationDetailModal.tsx
  ↓ 또 다른 props...
```

**파일 추적**:
- `App.tsx` → `Navbar` (6개 props)
- `App.tsx` → `HomePage` (4개 props)
- `App.tsx` → `MyPage`, `BoardPage`, `RepairPage` (각 2-3개 props)

#### 해결 방안: Context API

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../App';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // 로그인 로직
    const mockUser: User = {
      id: '1',
      email,
      name: email === 'admin@test.com' ? '관리자' : '홍길동',
      role: email === 'admin@test.com' ? 'admin' : 'user',
      phone: '010-1234-5678',
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// src/main.tsx
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

// src/components/layout/Navbar.tsx
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();  // ✅ Props 필요 없음!

  return (
    <nav>
      {user ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <button>로그인</button>
      )}
    </nav>
  );
}

// src/components/pages/HomePage.tsx
import { useAuth } from '../../contexts/AuthContext';

export function HomePage() {
  const { user } = useAuth();  // ✅ Props drilling 해결!

  return <div>환영합니다, {user?.name}님</div>;
}
```

---

### 6. LocalStorage 직접 사용 문제 💾

#### 현재 문제
```typescript
// 10개 이상 파일에서 반복:
localStorage.setItem('posts', JSON.stringify(posts));
const savedPosts = localStorage.getItem('posts');
const posts = savedPosts ? JSON.parse(savedPosts) : [];  // ❌ 에러 처리 없음
```

**발견 위치**:
- `BoardList.tsx`: 2회
- `PostDetail.tsx`: 4회
- `HomePage.tsx`: 2회
- `RentalHistory.tsx`: 1회
- 등등...

#### 문제점
1. **에러 처리 없음**: JSON 파싱 실패 시 앱 크래시
2. **중복 코드**: 같은 패턴 10번 이상 반복
3. **타입 안전성 부족**: `any`로 파싱됨
4. **테스트 어려움**: localStorage mock 필요
5. **변경 어려움**: 나중에 IndexedDB로 바꾸려면?

#### 해결 방안: Storage 추상화 레이어

```typescript
// src/lib/storage.ts
type StorageKey = 'posts' | 'rentals' | 'repairs' | 'user' | 'stations';

class Storage {
  private prefix = 'bike_app_';

  set<T>(key: StorageKey, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      return false;
    }
  }

  get<T>(key: StorageKey, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

export const storage = new Storage();

// 사용 예시
import { storage } from '@/lib/storage';
import type { Post } from '@/types';

// ✅ 타입 안전, 에러 처리됨
const posts = storage.get<Post[]>('posts', []);
storage.set('posts', [...posts, newPost]);
```

**추가 개선: React Hook 버전**
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import type { StorageKey } from '@/lib/storage';

export function useLocalStorage<T>(key: StorageKey, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    return storage.get(key, defaultValue);
  });

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

// 사용 예시
function BoardList() {
  const [posts, setPosts] = useLocalStorage<Post[]>('posts', []);

  const addPost = (newPost: Post) => {
    setPosts([...posts, newPost]);  // ✅ 자동으로 localStorage에 저장됨!
  };
}
```

---

## 🟡 중요 해결 과제 (MEDIUM SEVERITY)

### 7. alert() 남용 (46회 사용) 🚨

#### 문제
```typescript
// 곳곳에서 발견:
alert('로그인이 필요합니다');
alert('대여가 완료되었습니다');
alert('삭제되었습니다');
```

**문제점**:
- UI 블로킹 (사용자가 확인할 때까지 아무것도 못 함)
- 접근성 나쁨
- 모바일에서 UX 나쁨
- 커스터마이징 불가능

#### 해결 방안: Toast 알림 시스템

```bash
npm install sonner  # 이미 설치되어 있음!
```

```typescript
// src/App.tsx 또는 main.tsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>...</Routes>
    </>
  );
}

// 사용 예시
import { toast } from 'sonner';

// ❌ Before
alert('대여가 완료되었습니다');

// ✅ After
toast.success('대여가 완료되었습니다', {
  description: `${station.name}에서 대여하셨습니다`,
  duration: 3000,
});

toast.error('로그인이 필요합니다', {
  action: {
    label: '로그인',
    onClick: () => setShowLoginModal(true),
  },
});

toast.info('게시글이 삭제되었습니다');

toast.loading('처리 중...');
```

---

### 8. 접근성 문제 ♿

#### 색상만으로 상태 표시

**src/components/home/ListView.tsx:35-46**:
```typescript
// ❌ Bad - 색맹 사용자는 구분 못함
const getStatusColor = (count: number) => {
  if (count === 0) return 'bg-red-100 text-red-700';
  if (count < 3) return 'bg-orange-100 text-orange-700';
  return 'bg-green-100 text-green-700';
};

// ✅ Good - 아이콘 + 텍스트 추가
const getStatusInfo = (count: number) => {
  if (count === 0) return {
    color: 'bg-red-100 text-red-700',
    icon: '⚠️',
    text: '없음'
  };
  if (count < 3) return {
    color: 'bg-orange-100 text-orange-700',
    icon: '⚡',
    text: '부족'
  };
  return {
    color: 'bg-green-100 text-green-700',
    icon: '✅',
    text: '여유'
  };
};

const status = getStatusInfo(station.bikeCount);
<span className={status.color}>
  {status.icon} {station.bikeCount}대 ({status.text})
</span>
```

#### ARIA 라벨 누락

```typescript
// ❌ Bad - src/components/layout/Navbar.tsx:138
<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
  <Menu className="w-6 h-6" />
</button>

// ✅ Good
<button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
  aria-expanded={mobileMenuOpen}
>
  <Menu className="w-6 h-6" />
</button>

// 페이지네이션 버튼
<button
  onClick={() => setPage(page + 1)}
  aria-label="다음 페이지"
  disabled={page >= totalPages}
>
  →
</button>
```

#### 키보드 네비게이션 문제

```typescript
// ❌ Bad - MapView에서 마커가 키보드 접근 불가
<div onClick={() => onStationClick(station)}>
  <MapPin />
</div>

// ✅ Good
<button
  onClick={() => onStationClick(station)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onStationClick(station);
    }
  }}
  aria-label={`${station.name}, 자전거 ${station.bikeCount}대 이용 가능`}
  tabIndex={0}
>
  <MapPin />
</button>
```

---

### 9. 성능 최적화 부족 ⚡

#### Index as Key (리스트 렌더링 버그)

```typescript
// ❌ Bad - src/components/pages/AICourseRecommendPage.tsx:329
{courseInfo.highlights.map((highlight, index) => (
  <span key={index}>✨ {highlight}</span>
))}

// 문제: 리스트 순서가 바뀌면 React가 잘못 업데이트
// 해결: 안정적인 ID 사용
{courseInfo.highlights.map((highlight) => (
  <span key={highlight}>✨ {highlight}</span>
))}

// 또는 고유 ID 생성
{courseInfo.highlights.map((highlight, index) => (
  <span key={`highlight-${highlight}-${index}`}>✨ {highlight}</span>
))}
```

#### 인라인 함수 생성 (불필요한 리렌더링)

```typescript
// ❌ Bad - 매 렌더링마다 새 함수 생성
{stations.map(station => (
  <div key={station.id} onClick={() => onStationClick(station)}>
    {station.name}
  </div>
))}

// ✅ Good - useCallback으로 메모이제이션
import { useCallback } from 'react';

const handleStationClick = useCallback((stationId: string) => {
  const station = stations.find(s => s.id === stationId);
  if (station) onStationClick(station);
}, [stations, onStationClick]);

{stations.map(station => (
  <div key={station.id} onClick={() => handleStationClick(station.id)}>
    {station.name}
  </div>
))}
```

#### React.memo 미사용

```typescript
// src/components/board/BoardList.tsx - Post 아이템
// ❌ Bad - 하나의 post가 변경되면 모든 post 컴포넌트가 리렌더링
function PostItem({ post, onClick }: Props) {
  return <div onClick={onClick}>...</div>;
}

// ✅ Good - 해당 post가 변경될 때만 리렌더링
import { memo } from 'react';

const PostItem = memo(function PostItem({ post, onClick }: Props) {
  return <div onClick={onClick}>...</div>;
});
```

---

### 10. XSS 취약점 🔓

#### dangerouslySetInnerHTML 사용

**src/components/ui/chart.tsx:83**:
```typescript
// ⚠️ 위험: 사용자 입력이 여기 들어가면 XSS 공격 가능
<div dangerouslySetInnerHTML={{ __html: content }} />
```

**해결**:
```typescript
// 1. DOMPurify 설치
npm install dompurify
npm install --save-dev @types/dompurify

// 2. Sanitize 후 사용
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(content);
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

#### 사용자 입력 검증 부족

```typescript
// src/components/board/PostEditor.tsx
// ❌ Bad - 검증 없이 바로 저장
const handleSubmit = () => {
  const newPost = {
    title: titleInput,  // ⚠️ XSS 가능
    content: contentInput,  // ⚠️ XSS 가능
  };
  saveTolocalStorage(newPost);
};

// ✅ Good - 검증 + 이스케이프
import DOMPurify from 'dompurify';

const handleSubmit = () => {
  // 입력 검증
  if (titleInput.trim().length < 2) {
    toast.error('제목은 2자 이상 입력해주세요');
    return;
  }

  if (titleInput.length > 100) {
    toast.error('제목은 100자 이하로 입력해주세요');
    return;
  }

  // XSS 방지
  const newPost = {
    title: DOMPurify.sanitize(titleInput),
    content: DOMPurify.sanitize(contentInput),
  };

  saveToLocalStorage(newPost);
};
```

---

## 🟢 개선 권장 사항 (LOW-MEDIUM SEVERITY)

### 11. 코드 중복 제거

#### 버튼 스타일 반복 (50+ 회)

```typescript
// ❌ Bad - 모든 파일에서 반복
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  클릭
</button>

// ✅ Good - 재사용 가능한 컴포넌트
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

// 사용
<Button variant="primary" size="md">클릭</Button>
<Button variant="danger" size="sm">삭제</Button>
```

---

### 12. 컴포넌트 파일 크기 줄이기

#### 큰 컴포넌트 분리

**src/components/board/PostDetail.tsx (391줄)**:
```typescript
// ❌ Bad - 하나의 파일에 모든 기능
function PostDetail() {
  // 100줄: 상태 관리
  // 100줄: 댓글 로직
  // 100줄: 좋아요 로직
  // 91줄: 렌더링
}

// ✅ Good - 기능별로 분리
// src/components/board/PostDetail.tsx
function PostDetail({ postId }: Props) {
  const post = usePost(postId);
  return (
    <div>
      <PostHeader post={post} />
      <PostContent content={post.content} />
      <PostActions postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
}

// src/components/board/PostHeader.tsx
export function PostHeader({ post }: { post: Post }) {
  return <header>...</header>;
}

// src/components/board/CommentSection.tsx
export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState([]);
  // 댓글 관련 로직만
  return <div>...</div>;
}

// src/hooks/usePost.ts - 커스텀 훅으로 로직 분리
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // post 로드 로직
  }, [postId]);

  return { post, loading };
}
```

---

### 13. 날짜 처리 통일

#### 문제: 날짜 처리 로직이 곳곳에 산재

```typescript
// 각 파일마다 다른 방식:
new Date(post.createdAt).toLocaleDateString('ko-KR')
`${date.getMonth() + 1}월 ${date.getDate()}일`
createdAt: new Date(post.createdAt)
```

#### 해결: 유틸리티 함수

```typescript
// src/lib/date.ts
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(date: Date | string, formatStr = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: ko });
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ko });
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'yyyy년 M월 d일 HH:mm');
}

// 사용
import { formatRelativeTime, formatDate } from '@/lib/date';

<p>{formatRelativeTime(post.createdAt)}</p>  // "3시간 전"
<p>{formatDate(post.createdAt, 'M월 d일')}</p>  // "11월 15일"
```

---

### 14. 환경 변수 설정

```typescript
// .env
VITE_APP_TITLE=서울 따릉이 시뮬레이션
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK=true

// .env.production
VITE_APP_TITLE=서울 따릉이
VITE_API_BASE_URL=https://api.bikeseoul.com
VITE_ENABLE_MOCK=false

// src/lib/config.ts
export const config = {
  appTitle: import.meta.env.VITE_APP_TITLE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
} as const;

// 사용
import { config } from '@/lib/config';

const response = await fetch(`${config.apiBaseUrl}/stations`);
```

---

## 📊 우선순위별 실행 계획

### 🔴 Phase 1: 긴급 (1-2일)

1. **React Router 도입** - 라우팅 시스템 교체
   - 예상 시간: 4-6시간
   - 파일 수정: App.tsx, Navbar.tsx, 모든 페이지 컴포넌트
   - 난이도: ⭐⭐⭐

2. **Error Boundary 추가** - 앱 크래시 방지
   - 예상 시간: 1-2시간
   - 파일 추가: ErrorBoundary.tsx
   - 난이도: ⭐⭐

3. **타입 안전성 개선** - `any` 제거
   - 예상 시간: 3-4시간
   - 파일 수정: 9개 파일
   - 난이도: ⭐⭐

### 🟡 Phase 2: 중요 (3-5일)

4. **Context API 도입** - Props drilling 해결
   - 예상 시간: 4-6시간
   - 파일 추가: AuthContext.tsx, RentalContext.tsx
   - 난이도: ⭐⭐⭐

5. **Storage 추상화** - localStorage 직접 사용 제거
   - 예상 시간: 2-3시간
   - 파일 추가: storage.ts, useLocalStorage.ts
   - 난이도: ⭐⭐

6. **Toast 알림 시스템** - alert() 제거
   - 예상 시간: 2-3시간
   - 파일 수정: 20+ 개 파일
   - 난이도: ⭐

7. **접근성 개선** - ARIA labels, 키보드 네비게이션
   - 예상 시간: 4-5시간
   - 파일 수정: 10+ 개 파일
   - 난이도: ⭐⭐

### 🟢 Phase 3: 개선 (1-2주)

8. **컴포넌트 리팩토링** - 큰 파일 분리
   - 예상 시간: 8-10시간
   - 난이도: ⭐⭐⭐

9. **성능 최적화** - React.memo, useCallback 적용
   - 예상 시간: 4-6시간
   - 난이도: ⭐⭐

10. **보안 강화** - XSS 방지, DOMPurify 적용
    - 예상 시간: 3-4시간
    - 난이도: ⭐⭐

11. **테스트 추가** - 단위 테스트, E2E 테스트
    - 예상 시간: 20+ 시간
    - 난이도: ⭐⭐⭐⭐

---

## 📝 체크리스트

### 즉시 시작 가능한 항목
- [ ] React Router 설치 및 설정
- [ ] ErrorBoundary 컴포넌트 생성
- [ ] types/index.ts 파일 생성 및 타입 정의
- [ ] AuthContext 생성
- [ ] storage.ts 유틸리티 생성
- [ ] Sonner toast 설정
- [ ] .env 파일 생성

### 점진적 개선 항목
- [ ] alert() → toast 마이그레이션
- [ ] localStorage 직접 사용 → storage 유틸리티
- [ ] 인라인 함수 → useCallback
- [ ] 큰 컴포넌트 분리
- [ ] ARIA labels 추가
- [ ] React.memo 적용

### 장기 과제
- [ ] 백엔드 API 구축
- [ ] 서버 사이드 인증 구현
- [ ] 단위 테스트 추가
- [ ] E2E 테스트 추가
- [ ] CI/CD 파이프라인 구축

---

**총 예상 작업 시간**:
- Phase 1: 8-12시간
- Phase 2: 16-22시간
- Phase 3: 35-40시간
- **합계: 약 60-75시간 (1.5-2주)**

**권장 순서**: Phase 1 → Phase 2 → Phase 3 순차 진행
