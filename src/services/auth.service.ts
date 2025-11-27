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

// Singleton instances
const mockService = new MockAuthService();

/**
 * Real API Auth Service
 */
class RealAuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post(API_ENDPOINTS.auth.login, {
      email,
      password,
    });

    const data = response.data.data || response.data;

    // Store token
    if (data.token) {
      setAuthToken(data.token);
    }

    return data;
  }

  async signup(signupData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<{ user: User; token: string }> {
    const response = await apiClient.post(API_ENDPOINTS.auth.signup, signupData);

    const data = response.data.data || response.data;

    // Store token
    if (data.token) {
      setAuthToken(data.token);
    }

    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      // Clear token regardless of API response
      setAuthToken(null);
    }
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await apiClient.post(API_ENDPOINTS.auth.checkEmail, { email });
    return response.data.data || response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
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
