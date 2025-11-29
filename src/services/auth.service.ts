/**
 * Auth Service
 *
 * Handles authentication-related API calls
 * Automatically switches between mock and real API based on ApiModeContext
 */

import type { User } from '../types';
import { apiClient, setAuthToken } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockAuthService } from './mock.service';
import { authApi } from '../api';

// Singleton instances
const mockService = new MockAuthService();

/**
 * Real API Auth Service
 */
class RealAuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await authApi.loginUser({ email, password });
    const data = response.data;
    
    // API might return data wrapped in 'data' property or directly
    const result = (data as any).data || data;

    // Store token
    if (result.token) {
      setAuthToken(result.token);
    }

    return result;
  }

  async signup(signupData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<{ user: User; token: string }> {
    const response = await authApi.signupUser(signupData);
    const data = response.data;

    const result = (data as any).data || data;

    // Store token
    if (result.token) {
      setAuthToken(result.token);
    }

    return result;
  }

  async logout(): Promise<void> {
    try {
      // AuthApi doesn't have logout method generated yet, or it was missed?
      // Checking auth-api.ts, it only had login, signup, checkEmail.
      // If logout endpoint exists but not in openapi, we might need to use apiClient or add it.
      // For now, let's assume client-side logout is enough or use apiClient for logout if needed.
      // But wait, the original code called API_ENDPOINTS.auth.logout.
      // Let's keep using apiClient for logout for now if authApi doesn't have it.
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (e) {
      // Ignore logout errors
    } finally {
      // Clear token regardless of API response
      setAuthToken(null);
    }
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await authApi.checkEmailAvailability(email);
    return (response.data as any).data || response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // changePassword might not be in AuthApi yet based on previous view_file of auth-api.ts
    // It was not in the list of methods in auth-api.ts (only checkEmail, login, signup).
    // So we keep using apiClient for this one.
    await apiClient.post(API_ENDPOINTS.auth.changePassword, {
      oldPassword,
      newPassword,
    });
  }
}

const realService = new RealAuthService();

/**
 * Auth Service Factory
 *
 * Returns appropriate service based on mock mode
 */
export class AuthService {
  constructor(private useMockMode: boolean) {}

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = this.useMockMode
      ? await mockService.login(email, password)
      : await realService.login(email, password);

    // Store token in mock mode too
    if (this.useMockMode && result.token) {
      setAuthToken(result.token);
    }

    return result;
  }

  async signup(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<{ user: User; token: string }> {
    const result = this.useMockMode
      ? await mockService.signup(data)
      : await realService.signup(data);

    // Store token in mock mode too
    if (this.useMockMode && result.token) {
      setAuthToken(result.token);
    }

    return result;
  }

  logout(): Promise<void> {
    return this.useMockMode
      ? mockService.logout()
      : realService.logout();
  }

  checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return this.useMockMode
      ? mockService.checkEmailAvailability(email)
      : realService.checkEmailAvailability(email);
  }

  changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (this.useMockMode) {
      throw new Error('Password change not supported in mock mode');
    }
    return realService.changePassword(oldPassword, newPassword);
  }
}
