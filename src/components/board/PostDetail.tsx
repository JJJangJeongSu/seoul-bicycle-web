import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, MessageSquare, Edit, Trash2, Loader2, Send } from 'lucide-react';
import type { Post, Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';

type PostDetailProps = {
  postId: string;
  onBack: () => void;
  onEdit?: (post: Post) => void;
};

export function PostDetail({ postId, onBack, onEdit }: PostDetailProps) {
  const { user } = useAuth();
  const { boardService } = useServices();
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load post from service
        let foundPost = await boardService.getPostById(postId);

        // Also check localStorage for backwards compatibility
        if (!foundPost) {
          const savedPosts = localStorage.getItem('board_posts');
          const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
          foundPost = posts.find(p => p.id === postId) || null;
          if (foundPost) {
            foundPost = {
              ...foundPost,
              createdAt: new Date(foundPost.createdAt),
            };
          }
        }

        if (foundPost) {
          setPostData({
            ...foundPost,
          });
        } else {
          setError('게시글을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Failed to load post:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, user, boardService]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">게시글을 불러오는 중...</p>
      </div>
    );
  }

  // Show error state or not found
  if (error || !postData) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-destructive mb-4 text-xl">⚠️</div>
        <p className="text-gray-500 mb-4">{error || '게시글을 찾을 수 없습니다'}</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleComment = async () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력하세요');
      return;
    }

    try {
      setIsSubmittingComment(true);
      const createdComment = await boardService.createComment(postId, newComment);
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
      alert('댓글이 등록되었습니다');
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !postData) {
      alert('로그인이 필요합니다');
      return;
    }

    const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      // Delete post via service
      await boardService.deletePost(postData.id);

      // Also remove from localStorage (for backwards compatibility)
      const savedPosts = localStorage.getItem('board_posts');
      const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
      const updatedPosts = posts.filter(p => p.id !== postData.id);
      localStorage.setItem('board_posts', JSON.stringify(updatedPosts));

      // Dispatch event to notify other components
      window.dispatchEvent(new Event('board_updated'));

      alert('게시글이 삭제되었습니다');
      onBack();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const getCategoryBadge = (cat: string) => {
    const badges = {
      notice: { color: 'bg-red-100 text-red-700', label: '공지사항' },
      info: { color: 'bg-blue-100 text-blue-700', label: '정보공유' },
      question: { color: 'bg-green-100 text-green-700', label: '질문' },
      free: { color: 'bg-gray-100 text-gray-700', label: '자유' },
    };
    return badges[cat as keyof typeof badges] || badges.free;
  };

  const badge = getCategoryBadge(postData.category);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        목록으로
      </button>

      {/* Post Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded text-sm ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          
          <h1 className="text-2xl mb-4">{postData.title}</h1>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>{postData.author}</span>
              <span>{postData.createdAt.toLocaleString('ko-KR')}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {postData.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {comments.length}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[200px]">
          <p className="whitespace-pre-wrap">{postData.content}</p>
        </div>

        {/* Actions */}
        <div className="p-6 border-t flex items-center justify-end">
          {user && (user.id === postData.authorId || user.role === 'admin') && (
            <div className="flex gap-2">
              {/* 본인이 작성한 게시글이거나, 관리자가 작성한 글인 경우에만 수정 버튼 표시 */}
              {(user.id === postData.authorId) && (
                <button
                  onClick={() => onEdit?.(postData)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <Edit className="w-5 h-5" />
                  수정
                </button>
              )}
              {/* 본인이 작성한 게시글이거나, 관리자인 경우 삭제 버튼 표시 */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                <Trash2 className="w-5 h-5" />
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg mb-4">💬 댓글 ({comments.length})</h3>

        {/* Comment List */}
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              첫 번째 댓글을 남겨보세요!
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {comment.createdAt.toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        {user ? (
          <div className="border-t pt-4">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 resize-none"
                rows={3}
                disabled={isSubmittingComment}
              />
              <button
                onClick={handleComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="댓글 등록"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">
                {newComment.length} / 500
              </span>
            </div>
          </div>
        ) : (
          <div className="border-t pt-4 text-center text-gray-500">
            <p>댓글을 작성하려면 로그인이 필요합니다</p>
          </div>
        )}
      </div>
    </div>
  );
}