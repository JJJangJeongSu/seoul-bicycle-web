import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, SignupData } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (data: SignupData) => void;
  logout: () => void;
  showLoginModal: boolean;
  showSignupModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  setShowSignupModal: (show: boolean) => void;
  openLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const login = useCallback((email: string, password: string) => {
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
  }, []);

  const signup = useCallback((data: SignupData) => {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      phone: data.phone,
    };
    setUser(newUser);
    setShowSignupModal(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Dispatch custom event for RentalContext to listen
    window.dispatchEvent(new CustomEvent('auth:logout'));
    navigate('/');
  }, [navigate]);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        showLoginModal,
        showSignupModal,
        setShowLoginModal,
        setShowSignupModal,
        openLoginModal,
      }}
    >
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
