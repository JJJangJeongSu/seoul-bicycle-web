/**
 * =====================================================
 * Posts Controller (Community Board)
 * =====================================================
 *
 * 커뮤니티 게시판 관련 비즈니스 로직 처리
 *
 * Functions:
 * - getAll  - 게시글 목록 조회
 * - getById - 게시글 상세 조회
 * - create  - 게시글 작성
 * - update  - 게시글 수정
 * - remove  - 게시글 삭제
 */

const { sendSuccess, sendError, calculatePagination } = require('../utils/response');
const PostModel = require('../models/Post.model');

// =====================================================
// 게시글 목록 조회
// =====================================================

/**
 * 게시글 목록 조회
 *
 * @route   GET /api/posts
 * @access  Public (로그인 선택)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.query - 쿼리 파라미터
 * @param {string} req.query.category - 카테고리 필터
 * @param {string} req.query.search - 검색어
 * @param {number} req.query.page - 페이지 번호
 * @param {number} req.query.limit - 페이지당 항목 수
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getAll(req, res, next) {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    // TODO: 1. 필터 조건 구성
    // const filters = {};
    // if (category) filters.category = category;
    // if (search) filters.search = search;

    // TODO: 2. 게시글 목록 조회 (페이지네이션)
    // - 고정 게시글(isPinned=true)을 먼저 표시
    // - 그 다음 일반 게시글을 최신순으로 정렬
    //
    // const offset = (page - 1) * limit;
    // const { posts, totalCount } = await PostModel.findAll({
    //   ...filters,
    //   limit,
    //   offset,
    // });

    // TODO: 3. 페이지네이션 정보 계산
    // const pagination = calculatePagination(totalCount, page, limit);

    // Placeholder response
    return sendSuccess(
      res,
      {
        posts: [
          {
            id: 'P-1731672000123',
            authorId: 'user_id',
            authorName: '홍길동',
            category: 'info',
            title: '따릉이 이용 팁',
            content: '따릉이를 이용할 때 유용한 팁들을 공유합니다...',
            views: 42,
            likes: 5,
            commentCount: 3,
            isPinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
      200,
      {
        pagination: calculatePagination(1, page, limit),
      }
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 게시글 상세 조회
// =====================================================

/**
 * 게시글 상세 조회 (조회수 증가)
 *
 * @route   GET /api/posts/:id
 * @access  Public (로그인 선택)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - 게시글 ID
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function getById(req, res, next) {
  try {
    const { id } = req.params;

    // TODO: 1. 게시글 조회
    // const post = await PostModel.findById(id);
    // if (!post) {
    //   return sendError(res, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 조회수 증가
    // await PostModel.incrementViews(id);
    // post.views += 1;

    // Placeholder response
    return sendSuccess(res, {
      post: {
        id,
        authorId: 'user_id',
        authorName: '홍길동',
        category: 'info',
        title: '따릉이 이용 팁',
        content: '따릉이를 이용할 때 유용한 팁들을 공유합니다...\n\n1. 팁1\n2. 팁2\n3. 팁3',
        views: 43,
        likes: 5,
        commentCount: 3,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 게시글 작성
// =====================================================

/**
 * 게시글 작성
 *
 * @route   POST /api/posts
 * @access  Private
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.category - 카테고리
 * @param {string} req.body.title - 제목
 * @param {string} req.body.content - 내용
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function create(req, res, next) {
  try {
    const { category, title, content } = req.body;
    const userId = req.user.id;

    // TODO: 1. 사용자 이름 조회 (author_name 필드에 스냅샷 저장)
    // const user = await UserModel.findById(userId);

    // TODO: 2. 게시글 ID 생성 (예: P-1731672000123)
    // const postId = generatePostId(); // 'P-' + timestamp

    // TODO: 3. 게시글 저장
    // const post = await PostModel.create({
    //   id: postId,
    //   authorId: userId,
    //   authorName: user.name,
    //   category,
    //   title,
    //   content,
    //   views: 0,
    //   likes: 0,
    //   commentCount: 0,
    //   isPinned: false,
    // });

    // Placeholder response
    return sendSuccess(
      res,
      {
        post: {
          id: 'P-1731672000123',
          authorId: userId,
          authorName: req.user.name || '사용자',
          category,
          title,
          content,
          views: 0,
          likes: 0,
          commentCount: 0,
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 게시글 수정
// =====================================================

/**
 * 게시글 수정
 *
 * @route   PUT /api/posts/:id
 * @access  Private (작성자 또는 관리자)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - 게시글 ID
 * @param {Object} req.body - 요청 본문
 * @param {string} req.body.title - 제목
 * @param {string} req.body.content - 내용
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // TODO: 1. 게시글 존재 확인
    // const post = await PostModel.findById(id);
    // if (!post) {
    //   return sendError(res, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 권한 확인 (작성자 또는 관리자만 수정 가능)
    // if (post.authorId !== userId && userRole !== 'admin') {
    //   return sendError(res, 'FORBIDDEN', '게시글을 수정할 권한이 없습니다.', 403);
    // }

    // TODO: 3. 게시글 업데이트
    // const updatedPost = await PostModel.update(id, { title, content });

    // Placeholder response
    return sendSuccess(res, {
      post: {
        id,
        title,
        content,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// 게시글 삭제
// =====================================================

/**
 * 게시글 삭제
 *
 * @route   DELETE /api/posts/:id
 * @access  Private (작성자 또는 관리자)
 *
 * @param {Object} req - Express request 객체
 * @param {Object} req.user - 인증된 사용자 정보
 * @param {Object} req.params - URL 파라미터
 * @param {string} req.params.id - 게시글 ID
 * @param {Object} res - Express response 객체
 * @param {Function} next - Express next 함수
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // TODO: 1. 게시글 존재 확인
    // const post = await PostModel.findById(id);
    // if (!post) {
    //   return sendError(res, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.', 404);
    // }

    // TODO: 2. 권한 확인 (작성자 또는 관리자만 삭제 가능)
    // if (post.authorId !== userId && userRole !== 'admin') {
    //   return sendError(res, 'FORBIDDEN', '게시글을 삭제할 권한이 없습니다.', 403);
    // }

    // TODO: 3. 게시글 삭제
    // await PostModel.delete(id);

    // Placeholder response
    return sendSuccess(res, {
      message: '게시글이 삭제되었습니다.',
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// Export
// =====================================================

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
