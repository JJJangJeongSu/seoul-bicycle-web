import { Bike, User as UserIcon, Menu, X, MapPin, MessageSquare, Wrench, LayoutDashboard, Route, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Rental } from '../../App';
import { useState } from 'react';

type NavbarProps = {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  currentRental: Rental | null;
};

export function Navbar({ user, onLoginClick, onLogout, currentRental }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            <div className="bg-white rounded-full p-2 shadow-md">
              <Bike className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl drop-shadow-md">서울 따릉이 시뮬레이션</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive('/') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
              }`}
            >
              <MapPin className="w-5 h-5" />
              대여소 현황
            </button>

            <button
              onClick={() => navigate('/route')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive('/route') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
              }`}
            >
              <Route className="w-5 h-5" />
              길찾기
            </button>

            <button
              onClick={() => navigate('/ai-course')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive('/ai-course') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              AI 코스 추천
            </button>

            <button
              onClick={() => navigate('/board')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive('/board') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              게시판
            </button>

            {(!user || user.role !== 'admin') && (
              <button
                onClick={() => navigate('/repair')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isActive('/repair') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
                }`}
              >
                <Wrench className="w-5 h-5" />
                고장 신고
              </button>
            )}

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => navigate('/mypage')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isActive('/mypage') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                    마이페이지
                  </button>
                )}

                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      location.pathname.startsWith('/admin') ? 'bg-white text-primary shadow-lg scale-105' : 'hover:bg-white/20'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    관리자
                  </button>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/30">
                  <div className="text-right">
                    <div className="text-sm drop-shadow-md">{user.name}</div>
                    <div className="text-xs opacity-90">{user.role === 'admin' ? '✨ 관리자' : '💖 일반 회원'}</div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-5 py-2 bg-white text-primary rounded-full hover:bg-muted transition-all hover:scale-105 shadow-md"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 bg-white text-primary rounded-full hover:bg-muted transition-all hover:scale-105 shadow-md"
              >
                로그인
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Current Rental Alert */}
        {currentRental && (
          <div className="bg-accent text-gray-900 px-4 py-3 rounded-2xl mb-2 flex items-center justify-between shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-1.5 shadow">
                <Bike className="w-5 h-5 text-secondary" />
              </div>
              <span>🚴 대여 중인 자전거: {currentRental.bikeId}</span>
            </div>
            <span className="bg-white px-3 py-1 rounded-full text-sm shadow">⏰ 반납 필요</span>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/30">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
              >
                대여소 현황
              </button>
              <button
                onClick={() => { navigate('/route'); setMobileMenuOpen(false); }}
                className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
              >
                길찾기
              </button>
              <button
                onClick={() => { navigate('/ai-course'); setMobileMenuOpen(false); }}
                className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
              >
                AI 코스 추천
              </button>
              <button
                onClick={() => { navigate('/board'); setMobileMenuOpen(false); }}
                className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
              >
                게시판
              </button>

              {(!user || user.role !== 'admin') && (
                <button
                  onClick={() => { navigate('/repair'); setMobileMenuOpen(false); }}
                  className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
                >
                  고장 신고
                </button>
              )}

              {user ? (
                <>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => { navigate('/mypage'); setMobileMenuOpen(false); }}
                      className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
                    >
                      마이페이지
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                      className="px-4 py-2.5 text-left hover:bg-white/20 rounded-full transition-all"
                    >
                      관리자
                    </button>
                  )}
                  <div className="px-3 py-3 border-t border-white/30 mt-2">
                    <div className="mb-2">{user.name} ({user.role === 'admin' ? '✨ 관리자' : '💖 일반 회원'})</div>
                    <button
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      className="mt-2 px-4 py-2 bg-white text-primary rounded-full hover:bg-muted w-full transition-all shadow-md"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="mx-3 py-2 bg-white text-primary rounded-full hover:bg-muted shadow-md transition-all"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
