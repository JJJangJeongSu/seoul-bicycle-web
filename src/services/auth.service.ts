/**
 * Auth Service
 *
 * Handles authentication-related API calls
 */

import { authApi } from '../api';
import type { User, SignupData } from '../types';
import { setAuthToken } from '../api/config';

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await authApi.loginUser({ email, password });
  // Casting to any because generated types might be incomplete regarding the 'data' field
  const data = (response.data as any).data;
  
  if (!data || !data.token || !data.user) {
     throw new Error('Invalid response from login API');
  }

  const { user, token } = data;
  setAuthToken(token);
  return { user, token };
};

export const signup = async (data: SignupData): Promise<{ user: User; token: string }> => {
  const response = await authApi.signupUser(data);
  const responseData = (response.data as any).data;

  if (!responseData || !responseData.token || !responseData.user) {
     throw new Error('Invalid response from signup API');
  }

  const { user, token } = responseData;
  setAuthToken(token);
  return { user, token };
};

export const logout = async (): Promise<void> => {
  setAuthToken(null);
};

export const checkEmailAvailability = async (email: string): Promise<{ available: boolean }> => {
  const response = await authApi.checkEmailAvailability(email);
  return (response.data as any).data || response.data;
};



