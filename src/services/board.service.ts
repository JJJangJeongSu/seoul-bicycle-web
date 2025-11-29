/**
 * Board Service
 *
 * Handles board/post-related API calls
 */

import type { Post } from '../types';
import { apiClient } from './api/client';
import { API_ENDPOINTS } from './api/config';
import { MockBoardService } from './mock.service';
import { boardApi } from '../api';

const mockService = new MockBoardService();

class RealBoardService {
  async getAllPosts(category?: string): Promise<Post[]> {
    const response = await boardApi.getAllPosts(undefined, undefined, undefined, category as any);
    return (response.data as any).data || response.data;
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      const response = await boardApi.getPostById(id);
      return (response.data as any).data || response.data;
    } catch (error) {
      return null;
    }
  }

  async createPost(post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> {
    // API expects only title, content, category. Author info is inferred from token.
    const response = await boardApi.createPost({
      title: post.title,
      content: post.content,
      category: post.category as any,
    });
    return (response.data as any).data || response.data;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    // API only allows updating title and content
    const response = await boardApi.updatePost(id, {
      title: updates.title,
      content: updates.content,
    });
    return (response.data as any).data || response.data;
  }

  async deletePost(id: string): Promise<void> {
    await boardApi.deletePost(id);
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
