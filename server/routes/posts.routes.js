/**
 * =====================================================
 * Posts Routes (Community Board)
 * =====================================================
 *
 * 커뮤니티 게시판 관련 라우트
 *
 * Base Path: /api/posts
 *
 * Endpoints:
 * - GET    /        - 게시글 목록 조회
 * - POST   /        - 게시글 작성
 * - GET    /:id     - 게시글 상세 조회
 * - PUT    /:id     - 게시글 수정
 * - DELETE /:id     - 게시글 삭제
 */

const express = require('express');
const router = express.Router();

// 컨트롤러 import
const postsController = require('../controllers/posts.controller');

// 미들웨어 import
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const {
  validateCreatePost,
  validateGetPosts,
  validateId,
} = require('../middleware/validateRequest');

// =====================================================
// Routes
// =====================================================

/**
 * @route   GET /api/posts
 * @desc    게시글 목록 조회
 * @access  Public (로그인 선택)
 *
 * Query Params:
 * - category: string (optional) - notice | info | question | free
 * - search: string (optional) - 제목 또는 내용 검색
 * - page: number (optional, default: 1)
 * - limit: number (optional, default: 20)
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "posts": [
 *       {
 *         "id": "P-123456789",
 *         "authorId": "user_id",
 *         "authorName": "홍길동",
 *         "category": "info",
 *         "title": "게시글 제목",
 *         "content": "게시글 내용...",
 *         "views": 42,
 *         "likes": 5,
 *         "commentCount": 3,
 *         "isPinned": false,
 *         "createdAt": "2024-11-15T10:30:00Z"
 *       }
 *     ]
 *   },
 *   "pagination": {...}
 * }
 */
router.get('/', optionalAuthenticate, validateGetPosts, postsController.getAll);

/**
 * @route   POST /api/posts
 * @desc    게시글 작성
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Request Body:
 * {
 *   "category": "info",
 *   "title": "게시글 제목",
 *   "content": "게시글 내용..."
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "post": {
 *       "id": "P-123456789",
 *       "authorId": "user_id",
 *       "authorName": "홍길동",
 *       "category": "info",
 *       "title": "게시글 제목",
 *       "content": "게시글 내용...",
 *       "createdAt": "2024-11-15T10:30:00Z"
 *     }
 *   }
 * }
 */
router.post('/', authenticate, validateCreatePost, postsController.create);

/**
 * @route   GET /api/posts/:id
 * @desc    게시글 상세 조회 (조회수 증가)
 * @access  Public (로그인 선택)
 *
 * Path Params:
 * - id: string (예: P-123456789)
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "post": {
 *       "id": "P-123456789",
 *       ...
 *     }
 *   }
 * }
 */
router.get('/:id', optionalAuthenticate, validateId('id'), postsController.getById);

/**
 * @route   PUT /api/posts/:id
 * @desc    게시글 수정
 * @access  Private (작성자 또는 관리자)
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Path Params:
 * - id: string
 *
 * Request Body:
 * {
 *   "title": "수정된 제목",
 *   "content": "수정된 내용..."
 * }
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "post": {...}
 *   }
 * }
 */
router.put('/:id', authenticate, validateId('id'), postsController.update);

/**
 * @route   DELETE /api/posts/:id
 * @desc    게시글 삭제
 * @access  Private (작성자 또는 관리자)
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Path Params:
 * - id: string
 *
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "message": "게시글이 삭제되었습니다."
 *   }
 * }
 */
router.delete('/:id', authenticate, validateId('id'), postsController.remove);

// =====================================================
// Export
// =====================================================

module.exports = router;
