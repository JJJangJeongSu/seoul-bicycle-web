/**
 * Board Service
 *
 * Handles board-related API calls
 */

import type { Post } from '../types';
import { mockPosts } from '../lib/mockData';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllPosts = async (category?: string): Promise<Post[]> => {
  await delay();
  if (category) {
    return mockPosts.filter(p => p.category === category);
  }
  return [...mockPosts];
};

export const getPostById = async (id: string): Promise<Post | null> => {
  await delay();
  const post = mockPosts.find(p => p.id === id);
  if (post) {
    // Increment views
    const index = mockPosts.findIndex(p => p.id === id);
    mockPosts[index] = { ...post, views: post.views + 1 };
    return mockPosts[index];
  }
  return null;
};

export const createPost = async (post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt'>): Promise<Post> => {
  await delay();

  const newPost: Post = {
    ...post,
    id: `P-${Date.now()}`,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date(),
  };

  mockPosts.unshift(newPost);
  return newPost;
};

export const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
  await delay();

  const index = mockPosts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Post not found');

  mockPosts[index] = { ...mockPosts[index], ...updates };
  return mockPosts[index];
};

export const deletePost = async (id: string): Promise<void> => {
  await delay();

  const index = mockPosts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Post not found');

  mockPosts.splice(index, 1);
};
