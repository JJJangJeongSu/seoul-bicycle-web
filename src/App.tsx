import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/pages/HomePage';
import { MyPage } from './components/pages/MyPage';
import { BoardPage } from './components/pages/BoardPage';
import { RepairPage } from './components/pages/RepairPage';
import { AdminPage } from './components/pages/AdminPage';
import { AICourseRecommendPage } from './components/pages/AICourseRecommendPage';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';
import { useAuth } from './contexts/AuthContext';

// Re-export types for backward compatibility
export type { User, Station, Rental } from './types';

export default function App() {
  const {
    user,
    showLoginModal,
    showSignupModal,
    login,
    signup,
    setShowLoginModal,
    setShowSignupModal,
  } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/mypage"
            element={
              user && user.role !== 'admin'
                ? <MyPage />
                : <Navigate to="/" replace />
            }
          />

          <Route path="/board" element={<BoardPage />} />
          <Route path="/repair" element={<RepairPage />} />
          <Route path="/ai-course" element={<AICourseRecommendPage />} />

          <Route
            path="/admin/*"
            element={
              user?.role === 'admin'
                ? <AdminPage />
                : <Navigate to="/" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={login}
          onSignupClick={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSignup={signup}
          onLoginClick={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
}
