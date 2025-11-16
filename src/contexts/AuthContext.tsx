import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, SignupData } from '../types';
import { useApiMode } from './ApiModeContext';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
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
  const { useMockMode } = useApiMode();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const authService = new AuthService(useMockMode);
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [useMockMode]);

  const signup = useCallback(async (data: SignupData) => {
    try {
      setLoading(true);
      const authService = new AuthService(useMockMode);
      const { user: newUser } = await authService.signup(data);
      setUser(newUser);
      setShowSignupModal(false);
    } catch (error) {
      console.error('Signup failed:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [useMockMode]);

  const logout = useCallback(async () => {
    try {
      const authService = new AuthService(useMockMode);
      await authService.logout();
      setUser(null);
      // Dispatch custom event for RentalContext to listen
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user even if API call fails
      setUser(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    }
  }, [useMockMode, navigate]);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
