import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, SignupData } from '../types';
import * as authService from '../services/auth.service';
import { useLogin, useSignup } from '../hooks/queries/useAuth';

// AuthContextType 인터페이스 정의
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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: loggedInUser } = await loginMutation.mutateAsync({ email, password });
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loginMutation]);

  const signup = useCallback(async (data: SignupData) => {
    try {
      setLoading(true);
      const { user: newUser } = await signupMutation.mutateAsync(data);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setShowSignupModal(false);
    } catch (error) {
      console.error('Signup failed:', error);
      // TODO: Error handling 
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
      // Dispatch custom event for RentalContext to listen
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user even if API call fails
      setUser(null);
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    }
  }, [navigate]);

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
