/**
 * Board Service
 *
 * Handles board-related API calls
 */

import type { Post } from '../types';
import { boardApi } from '../api';
import { GetAllPostsCategoryEnum } from '../../CodeGenerator/apis/board-api';

export const getAllPosts = async (page?: number, limit?: number, search?: string, category?: GetAllPostsCategoryEnum): Promise<Post[]> => {
  const response = await boardApi.getAllPosts(page, limit, search, category); 
  return (response.data as any).data || response.data;
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const response = await boardApi.getPostById(id);
    return (response.data as any).data || response.data;
  } catch (error) {
    return null;
  }
};

export const createPost = async (post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> => {
  // API expects title, content, category.
  const response = await boardApi.createPost({
    title: post.title,
    content: post.content,
    category: post.category as any,
  });
  return (response.data as any).data || response.data;
};

export const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
  const response = await boardApi.updatePost(id, {
    title: updates.title,
    content: updates.content,
  });
  return (response.data as any).data || response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await boardApi.deletePost(id);
};
