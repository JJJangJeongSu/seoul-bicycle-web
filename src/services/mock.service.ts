/**
 * Mock Service
 *
 * Provides mock data with async interface to simulate real API calls
 * Used when useMockMode is true
 */

import type { Station, Rental, Post, Repair, User } from '../types';
import { mockStations, mockRentals, mockPosts, mockRepairs } from '../lib/mockData';
import { API_CONFIG } from './api/config';

/**
 * Simulates network delay
 */
const delay = (ms: number = API_CONFIG.mockDelay) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock Authentication Service
 */
export class MockAuthService {
  async login(email: string, _password: string): Promise<{ user: User; token: string }> {
    await delay();

    const user: User = {
      id: Date.now().toString(),
      email,
      name: email === 'admin@test.com' ? '관리자' : '홍길동',
      role: email === 'admin@test.com' ? 'admin' : 'user',
      phone: '010-1234-5678',
    };

    return {
      user,
      token: 'mock_token_' + Date.now(),
    };
  }

  async signup(data: { email: string; password: string; name: string; phone: string }): Promise<{ user: User; token: string }> {
    await delay();

    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'user',
      phone: data.phone,
    };

    return {
      user,
      token: 'mock_token_' + Date.now(),
    };
  }

  async logout(): Promise<void> {
    await delay(300);
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    await delay(500);
    // Mock: admin@test.com is taken
    return { available: email !== 'admin@test.com' };
  }
}

/**
 * Mock Station Service
 */
export class MockStationService {
  private stations: Station[] = [...mockStations];

  async getAllStations(): Promise<Station[]> {
    await delay();
    return [...this.stations];
  }

  async getStationById(id: string): Promise<Station | null> {
    await delay();
    return this.stations.find(s => s.id === id) || null;
  }

  async getNearestStation(latitude: number, longitude: number): Promise<Station | null> {
    await delay();

    // Calculate distances and find nearest
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const activeStations = this.stations.filter(s => s.status === 'active' && s.bikeCount > 0);
    if (activeStations.length === 0) return null;

    let nearest = activeStations[0];
    let minDistance = calculateDistance(latitude, longitude, nearest.latitude, nearest.longitude);

    for (const station of activeStations) {
      const distance = calculateDistance(latitude, longitude, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    }

    return nearest;
  }

  async getStationsStatus(): Promise<{ total: number; active: number; inactive: number; available: number }> {
    await delay();

    const total = this.stations.length;
    const active = this.stations.filter(s => s.status === 'active').length;
    const inactive = this.stations.filter(s => s.status === 'inactive').length;
    const available = this.stations.filter(s => s.status === 'active' && s.bikeCount > 0).length;

    return { total, active, inactive, available };
  }

  async updateStationBikeCount(id: string, count: number): Promise<Station> {
    await delay();

    const index = this.stations.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Station not found');

    this.stations[index] = { ...this.stations[index], bikeCount: count };
    return this.stations[index];
  }
}

/**
 * Mock Rental Service
 */
export class MockRentalService {
  private rentals: Rental[] = [...mockRentals];

  async createRental(userId: string, stationId: string): Promise<Rental> {
    await delay();

    const rental: Rental = {
      id: `R-${Date.now()}`,
      userId,
      bikeId: `SPB-${Math.floor(Math.random() * 90000) + 10000}`,
      startStationId: stationId,
      rentalTime: new Date(),
      status: 'rented',
    };

    this.rentals.push(rental);
    return rental;
  }

  async returnRental(rentalId: string, stationId: string, distance: number, duration: number): Promise<Rental> {
    await delay();

    const index = this.rentals.findIndex(r => r.id === rentalId);
    if (index === -1) throw new Error('Rental not found');

    this.rentals[index] = {
      ...this.rentals[index],
      endStationId: stationId,
      returnTime: new Date(),
      distance,
      duration,
      status: 'returned',
    };

    return this.rentals[index];
  }

  async getUserRentals(userId: string): Promise<Rental[]> {
    await delay();
    return this.rentals.filter(r => r.userId === userId);
  }

  async getRentalById(id: string): Promise<Rental | null> {
    await delay();
    return this.rentals.find(r => r.id === id) || null;
  }
}

/**
 * Mock Board Service
 */
export class MockBoardService {
  private posts: Post[] = [...mockPosts];

  async getAllPosts(category?: string): Promise<Post[]> {
    await delay();
    if (category) {
      return this.posts.filter(p => p.category === category);
    }
    return [...this.posts];
  }

  async getPostById(id: string): Promise<Post | null> {
    await delay();
    const post = this.posts.find(p => p.id === id);
    if (post) {
      // Increment views
      const index = this.posts.findIndex(p => p.id === id);
      this.posts[index] = { ...post, views: post.views + 1 };
      return this.posts[index];
    }
    return null;
  }

  async createPost(post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> {
    await delay();

    const newPost: Post = {
      ...post,
      id: `P-${Date.now()}`,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    await delay();

    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');

    this.posts[index] = { ...this.posts[index], ...updates };
    return this.posts[index];
  }

  async deletePost(id: string): Promise<void> {
    await delay();

    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');

    this.posts.splice(index, 1);
  }
}

/**
 * Mock Repair Service
 */
export class MockRepairService {
  private repairs: Repair[] = [...mockRepairs];

  async createRepair(repair: Omit<Repair, 'id' | 'createdAt' | 'status'>): Promise<Repair> {
    await delay();

    const newRepair: Repair = {
      ...repair,
      id: `REP-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
    };

    this.repairs.unshift(newRepair);
    return newRepair;
  }

  async getMyRepairs(reporterId: string): Promise<Repair[]> {
    await delay();
    return this.repairs.filter(r => r.reporterId === reporterId);
  }

  async getAllRepairs(): Promise<Repair[]> {
    await delay();
    return [...this.repairs];
  }

  async getRepairById(id: string): Promise<Repair | null> {
    await delay();
    return this.repairs.find(r => r.id === id) || null;
  }

  async updateRepairStatus(id: string, status: Repair['status'], adminNote?: string): Promise<Repair> {
    await delay();

    const index = this.repairs.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Repair not found');

    this.repairs[index] = {
      ...this.repairs[index],
      status,
      adminNote,
      completedAt: status === 'completed' ? new Date() : undefined,
    };

    return this.repairs[index];
  }
}

/**
 * Mock Admin Service
 */
export class MockAdminService {
  async getStatistics(): Promise<{
    totalUsers: number;
    totalStations: number;
    totalRentals: number;
    activeRentals: number;
  }> {
    await delay();

    return {
      totalUsers: 1523,
      totalStations: mockStations.length,
      totalRentals: mockRentals.length,
      activeRentals: mockRentals.filter(r => r.status === 'rented').length,
    };
  }

  async getAllUsers(): Promise<User[]> {
    await delay();

    // Mock users
    return [
      {
        id: '1',
        email: 'user@test.com',
        name: '홍길동',
        role: 'user',
        phone: '010-1234-5678',
      },
      {
        id: '2',
        email: 'admin@test.com',
        name: '관리자',
        role: 'admin',
        phone: '010-9876-5432',
      },
    ];
  }

  async getUserById(id: string): Promise<User | null> {
    await delay();

    const users = await this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }
}

/**
 * Mock User Service
 */
export class MockUserService {
  async getUserStatistics(userId: string): Promise<{
    totalRentals: number;
    totalDistance: number;
    totalDuration: number;
    averageDistance: number;
    averageDuration: number;
  }> {
    await delay();

    const userRentals = mockRentals.filter(r => r.userId === userId && r.status === 'returned');

    const totalDistance = userRentals.reduce((sum, r) => sum + (r.distance || 0), 0);
    const totalDuration = userRentals.reduce((sum, r) => sum + (r.duration || 0), 0);

    return {
      totalRentals: userRentals.length,
      totalDistance,
      totalDuration,
      averageDistance: userRentals.length > 0 ? totalDistance / userRentals.length : 0,
      averageDuration: userRentals.length > 0 ? totalDuration / userRentals.length : 0,
    };
  }
}
