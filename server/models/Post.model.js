/**
 * =====================================================
 * Post Model
 * =====================================================
 *
 * 게시글 데이터베이스 작업을 처리하는 모델
 *
 * Table: posts
 * Columns:
 * - id: VARCHAR(20) PRIMARY KEY
 * - author_id: VARCHAR(50)
 * - author_name: VARCHAR(100)
 * - category: ENUM('notice', 'info', 'question', 'free')
 * - title: VARCHAR(500)
 * - content: TEXT
 * - views: INT UNSIGNED
 * - likes: INT UNSIGNED
 * - comment_count: INT UNSIGNED
 * - is_pinned: BOOLEAN
 * - created_at: TIMESTAMP
 * - updated_at: TIMESTAMP
 */

const db = require('../config/database');

// =====================================================
// 조회 (Read)
// =====================================================

/**
 * ID로 게시글 조회
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<Object|null>} 게시글 객체 또는 null
 */
async function findById(id) {
  // TODO: ID로 게시글 조회
  const [rows] = await db.execute(
    'SELECT * FROM posts WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * 모든 게시글 조회 (필터링, 페이지네이션)
 *
 * @param {Object} options - 조회 옵션
 * @param {string} options.category - 카테고리 필터 (optional)
 * @param {string} options.search - 검색어 (제목 또는 내용) (optional)
 * @param {number} options.limit - 제한 개수 (optional)
 * @param {number} options.offset - 오프셋 (optional)
 * @returns {Promise<Object>} { posts: Array, totalCount: number }
 */
async function findAll(options = {}) {
  // TODO: 필터 조건에 맞는 게시글 조회
  // let sql = 'SELECT * FROM posts WHERE 1=1';
  // const params = [];
  //
  // if (options.category) {
  //   sql += ' AND category = ?';
  //   params.push(options.category);
  // }
  //
  // if (options.search) {
  //   sql += ' AND (title LIKE ? OR content LIKE ?)';
  //   const searchPattern = `%${options.search}%`;
  //   params.push(searchPattern, searchPattern);
  // }
  //
  // // 전체 개수 조회
  // const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
  // const [countRows] = await db.execute(countSql, params);
  // const totalCount = countRows[0].count;
  //
  // // 정렬: 고정 게시글 먼저, 그 다음 최신순
  // sql += ' ORDER BY is_pinned DESC, created_at DESC';
  //
  // if (options.limit) {
  //   sql += ' LIMIT ?';
  //   params.push(options.limit);
  // }
  //
  // if (options.offset) {
  //   sql += ' OFFSET ?';
  //   params.push(options.offset);
  // }
  //
  // const [rows] = await db.execute(sql, params);
  //
  // return {
  //   posts: rows,
  //   totalCount,
  // };

  return {
    posts: [],
    totalCount: 0,
  };
}

// =====================================================
// 생성 (Create)
// =====================================================

/**
 * 새 게시글 생성
 *
 * @param {Object} postData - 게시글 데이터
 * @returns {Promise<Object>} 생성된 게시글 객체
 */
async function create(postData) {
  // TODO: 게시글 생성
  // const { id, authorId, authorName, category, title, content, views, likes, commentCount, isPinned } = postData;
  //
  // await db.execute(
  //   `INSERT INTO posts
  //    (id, author_id, author_name, category, title, content, views, likes, comment_count, is_pinned)
  //    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //   [
  //     id,
  //     authorId,
  //     authorName,
  //     category,
  //     title,
  //     content,
  //     views || 0,
  //     likes || 0,
  //     commentCount || 0,
  //     isPinned || false,
  //   ]
  // );
  //
  // return await findById(id);

  return null;
}

// =====================================================
// 수정 (Update)
// =====================================================

/**
 * 게시글 정보 수정
 *
 * @param {string} id - 게시글 ID
 * @param {Object} updates - 업데이트할 필드
 * @returns {Promise<Object>} 업데이트된 게시글 객체
 */
async function update(id, updates) {
  // TODO: 동적으로 업데이트 쿼리 구성
  // const fields = [];
  // const values = [];
  //
  // if (updates.title !== undefined) {
  //   fields.push('title = ?');
  //   values.push(updates.title);
  // }
  //
  // if (updates.content !== undefined) {
  //   fields.push('content = ?');
  //   values.push(updates.content);
  // }
  //
  // if (updates.category !== undefined) {
  //   fields.push('category = ?');
  //   values.push(updates.category);
  // }
  //
  // if (updates.isPinned !== undefined) {
  //   fields.push('is_pinned = ?');
  //   values.push(updates.isPinned);
  // }
  //
  // if (fields.length === 0) {
  //   return await findById(id);
  // }
  //
  // values.push(id);
  //
  // await db.execute(
  //   `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`,
  //   values
  // );
  //
  // return await findById(id);

  return null;
}

/**
 * 조회수 증가
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<void>}
 */
async function incrementViews(id) {
  // TODO: 조회수 +1
  // await db.execute(
  //   'UPDATE posts SET views = views + 1 WHERE id = ?',
  //   [id]
  // );
}

/**
 * 좋아요 수 증가
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<void>}
 */
async function incrementLikes(id) {
  // TODO: 좋아요 수 +1
  // await db.execute(
  //   'UPDATE posts SET likes = likes + 1 WHERE id = ?',
  //   [id]
  // );
}

/**
 * 좋아요 수 감소
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<void>}
 */
async function decrementLikes(id) {
  // TODO: 좋아요 수 -1
  // await db.execute(
  //   'UPDATE posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?',
  //   [id]
  // );
}

/**
 * 댓글 수 증가
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<void>}
 */
async function incrementCommentCount(id) {
  // TODO: 댓글 수 +1
  // await db.execute(
  //   'UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?',
  //   [id]
  // );
}

/**
 * 댓글 수 감소
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<void>}
 */
async function decrementCommentCount(id) {
  // TODO: 댓글 수 -1
  // await db.execute(
  //   'UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ?',
  //   [id]
  // );
}

// =====================================================
// 삭제 (Delete)
// =====================================================

/**
 * 게시글 삭제
 *
 * @param {string} id - 게시글 ID
 * @returns {Promise<void>}
 */
async function deletePost(id) {
  // TODO: 게시글 삭제
  // await db.execute('DELETE FROM posts WHERE id = ?', [id]);
}

// =====================================================
// Export
// =====================================================

module.exports = {
  findById,
  findAll,
  create,
  update,
  incrementViews,
  incrementLikes,
  decrementLikes,
  incrementCommentCount,
  decrementCommentCount,
  deletePost,
};
