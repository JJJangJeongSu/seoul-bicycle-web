import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/pages/HomePage';
import { MyPage } from './components/pages/MyPage';
import { BoardPage } from './components/pages/BoardPage';
import { RepairPage } from './components/pages/RepairPage';
import { AdminPage } from './components/pages/AdminPage';
import { RoutePage } from './components/pages/RoutePage';
import { AICourseRecommendPage } from './components/pages/AICourseRecommendPage';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone: string;
};

export type Station = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  bikeCount: number;
  status: 'active' | 'inactive';
};

export type Rental = {
  id: string;
  userId: string;
  bikeId: string;
  startStationId: string;
  endStationId?: string;
  rentalTime: Date;
  returnTime?: Date;
  distance?: number;
  duration?: number;
  status: 'rented' | 'returned';
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentRental, setCurrentRental] = useState<Rental | null>(null);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // Mock login
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

  const handleSignup = (data: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      phone: data.phone,
    };
    setUser(newUser);
    setShowSignupModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentRental(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        currentRental={currentRental}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                currentRental={currentRental}
                onRent={setCurrentRental}
                onLoginRequired={() => setShowLoginModal(true)}
              />
            }
          />

          <Route
            path="/mypage"
            element={
              user && user.role !== 'admin'
                ? <MyPage user={user} />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/board"
            element={<BoardPage user={user} />}
          />

          <Route
            path="/repair"
            element={
              <RepairPage
                user={user}
                onLoginRequired={() => setShowLoginModal(true)}
              />
            }
          />

          <Route
            path="/route"
            element={<RoutePage />}
          />

          <Route
            path="/ai-course"
            element={<AICourseRecommendPage />}
          />

          <Route
            path="/admin/*"
            element={
              user?.role === 'admin'
                ? <AdminPage />
                : <Navigate to="/" replace />
            }
          />

          {/* 404 페이지 - 존재하지 않는 경로는 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSignupClick={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={handleSignup}
          onLoginClick={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
}
