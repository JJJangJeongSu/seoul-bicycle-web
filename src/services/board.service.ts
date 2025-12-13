/**
 * Board Service
 *
 * Handles board-related API calls
 */

import type { Post, PostCreate, Comment } from '../types';
import { boardApi } from '../api';
import { GetAllPostsCategoryEnum } from '../../CodeGenerator/apis/board-api';

export const getAllPosts = async (page?: number, limit?: number, search?: string, category?: GetAllPostsCategoryEnum): Promise<Post[]> => {
  const response = await boardApi.getAllPosts(page, limit, search, category); 
  const responseData = (response.data as any).data;
  
  // Map API response (snake_case) to Post type (camelCase)
  // API: author_name, created_at, comment_count, is_pinned
  // Type: author, createdAt, comments, isPinned
  return responseData.posts.map((post: any) => ({
    id: post.id,
    category: post.category,
    title: post.title,
    content: post.content,
    author: post.author_name, // Mapped from author_name
    authorId: post.author_id,
    views: post.views,
    likes: post.likes,
    comments: post.comment_count, // Mapped from comment_count
    createdAt: new Date(post.created_at), // Convert string to Date
    isPinned: Boolean(post.is_pinned), // Mapped from is_pinned
  }));
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const response = await boardApi.getPostById(id);
    const responseData = (response.data as any).data.post;
    
    // Map API response (snake_case) to Post type (camelCase)
    // API: author_name, created_at, comment_count, is_pinned
    // Type: author, createdAt, comments, isPinned
    return {
      id: responseData.id,
      category: responseData.category,
      title: responseData.title,
      content: responseData.content,
      author: responseData.author_name, // Mapped from author_name
      authorId: responseData.author_id,
      views: responseData.views,
      likes: responseData.likes,
      comments: responseData.comment_count, // Mapped from comment_count
      commentList: responseData.comments ? responseData.comments.map((comment: any) => ({
        id: comment.comment_id,
        postId: comment.post_id,
        authorName: comment.author_name,
        authorId: comment.author_id,
        content: comment.content,
        createdAt: new Date(comment.created_at),
      })) : [],
      createdAt: new Date(responseData.created_at), // Convert string to Date
      isPinned: Boolean(responseData.is_pinned), // Mapped from is_pinned
    };
  } catch (error) {
    return null;
  }
};

export const createPost = async (post: PostCreate): Promise<Post> => {
  // API expects title, content, category.
  const response = await boardApi.createPost_2({
    title: post.title,
    content: post.content,
    category: post.category as any,
  });
  const responseData = (response.data as any).data;
  
  // Map API response (snake_case) to Post type (camelCase)
  // API: author_name, created_at, comment_count, is_pinned
  // Type: author, createdAt, comments, isPinned
  return {
    id: responseData.id,
    category: responseData.category,
    title: responseData.title,
    content: responseData.content,
    author: responseData.author_name, // Mapped from author_name
    authorId: responseData.author_id,
    views: responseData.views,
    likes: responseData.likes,
    comments: responseData.comment_count, // Mapped from comment_count
    createdAt: new Date(responseData.created_at), // Convert string to Date
    isPinned: Boolean(responseData.is_pinned), // Mapped from is_pinned
  };
};

export const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
  const response = await boardApi.updatePost(id, {
    title: updates.title,
    content: updates.content,
  });
  const responseData = (response.data as any).data;
  
  // Map API response (snake_case) to Post type (camelCase)
  // API: author_name, created_at, comment_count, is_pinned
  // Type: author, createdAt, comments, isPinned
  return {
    id: responseData.id,
    category: responseData.category,
    title: responseData.title,
    content: responseData.content,
    author: responseData.author_name, // Mapped from author_name
    authorId: responseData.author_id,
    views: responseData.views,
    likes: responseData.likes,
    comments: responseData.comment_count, // Mapped from comment_count
    createdAt: new Date(responseData.created_at), // Convert string to Date
    isPinned: Boolean(responseData.is_pinned), // Mapped from is_pinned
  };
};

export const deletePost = async (id: string): Promise<void> => {
  await boardApi.deletePost(id);
};

export const createComment = async (postId: string, content: string): Promise<Comment> => {
  // Using boardApi.createPost because the generated code mapped the comment endpoint to this name
  // Endpoint: /board/posts/{postId}/comment
  const response = await boardApi.createPost(postId, { content });
  const responseData = (response.data as any).data.comment;

  return {
    id: responseData.comment_id,
    postId: postId,
    authorName: responseData.author_name,
    authorId: responseData.author_id,
    content: responseData.content,
    createdAt: new Date(responseData.created_at),
  };
};
