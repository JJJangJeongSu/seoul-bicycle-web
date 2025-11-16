/**
 * Board Service
 *
 * Handles board/post-related API calls
 */

import type { Post } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockBoardService } from './mock.service';

const mockService = new MockBoardService();

class RealBoardService {
  async getAllPosts(category?: string): Promise<Post[]> {
    const response = await apiClient.get(API_ENDPOINTS.board.getAllPosts, {
      params: category ? { category } : undefined,
    });
    return response.data.data || response.data;
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.board.getPostById(id));
      return response.data.data || response.data;
    } catch (error) {
      return null;
    }
  }

  async createPost(post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> {
    const response = await apiClient.post(API_ENDPOINTS.board.createPost, post);
    return response.data.data || response.data;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const response = await apiClient.patch(API_ENDPOINTS.board.updatePost(id), updates);
    return response.data.data || response.data;
  }

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.board.deletePost(id));
  }
}

const realService = new RealBoardService();

export class BoardService {
  constructor(private useMockMode: boolean) {}

  getAllPosts(category?: string): Promise<Post[]> {
    return this.useMockMode
      ? mockService.getAllPosts(category)
      : realService.getAllPosts(category);
  }

  getPostById(id: string): Promise<Post | null> {
    return this.useMockMode
      ? mockService.getPostById(id)
      : realService.getPostById(id);
  }

  createPost(post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> {
    return this.useMockMode
      ? mockService.createPost(post)
      : realService.createPost(post);
  }

  updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    return this.useMockMode
      ? mockService.updatePost(id, updates)
      : realService.updatePost(id, updates);
  }

  deletePost(id: string): Promise<void> {
    return this.useMockMode
      ? mockService.deletePost(id)
      : realService.deletePost(id);
  }
}
