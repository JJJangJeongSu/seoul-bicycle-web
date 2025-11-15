import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, ThumbsUp, MessageSquare, Share2, Edit, Trash2 } from 'lucide-react';
import { User } from '../../App';
import { mockPosts } from '../../lib/mockData';

type PostDetailProps = {
  postId: string;
  user: User | null;
  onBack: () => void;
};

export function PostDetail({ postId, user, onBack }: PostDetailProps) {
  const [postData, setPostData] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [userLikedPosts, setUserLikedPosts] = useState<string[]>([]);

  // Load post data
  useEffect(() => {
    const loadPost = () => {
      // Check if it's a saved post
      const savedPosts = localStorage.getItem('board_posts');
      const posts = savedPosts ? JSON.parse(savedPosts) : [];
      let foundPost = posts.find((p: any) => p.id === postId);

      if (foundPost) {
        foundPost = {
          ...foundPost,
          createdAt: new Date(foundPost.createdAt),
        };
      } else {
        // Check mock posts
        foundPost = mockPosts.find(p => p.id === postId);
      }

      if (foundPost) {
        // Load likes data
        const savedLikes = localStorage.getItem('post_likes');
        const likesMap: Record<string, number> = savedLikes ? JSON.parse(savedLikes) : {};
        
        setPostData({
          ...foundPost,
          likes: likesMap[foundPost.id] !== undefined ? likesMap[foundPost.id] : foundPost.likes,
        });
      }
    };

    loadPost();

    // Load user's liked posts
    if (user) {
      const userLikes = localStorage.getItem(`user_likes_${user.id}`);
      setUserLikedPosts(userLikes ? JSON.parse(userLikes) : []);
    }
  }, [postId, user]);

  // Check if user already liked this post
  useEffect(() => {
    if (user && postData) {
      setLiked(userLikedPosts.includes(postData.id));
    }
  }, [user, postData, userLikedPosts]);

  const [comments, setComments] = useState([
    {
      id: 'C-001',
      author: '김철수',
      authorId: '2',
      content: '좋은 정보 감사합니다!',
      createdAt: new Date('2024-11-07T16:20:00'),
      replies: [
        {
          id: 'C-002',
          author: '이영희',
          authorId: '3',
          content: '저도 가봐야겠어요',
          createdAt: new Date('2024-11-07T16:45:00'),
        },
      ],
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  if (!postData) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500">게시글을 찾을 수 없습니다</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleLike = () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    // Toggle like
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Update likes count
    const newLikesCount = newLikedState ? postData.likes + 1 : postData.likes - 1;
    setPostData({ ...postData, likes: newLikesCount });

    // Save likes data
    const savedLikes = localStorage.getItem('post_likes');
    const likesMap: Record<string, number> = savedLikes ? JSON.parse(savedLikes) : {};
    likesMap[postData.id] = newLikesCount;
    localStorage.setItem('post_likes', JSON.stringify(likesMap));

    // Update user's liked posts
    let updatedUserLikes = [...userLikedPosts];
    if (newLikedState) {
      updatedUserLikes.push(postData.id);
    } else {
      updatedUserLikes = updatedUserLikes.filter(id => id !== postData.id);
    }
    setUserLikedPosts(updatedUserLikes);
    localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(updatedUserLikes));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('board_updated'));
  };

  const handleComment = () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력하세요');
      return;
    }

    const comment = {
      id: `C-${Date.now()}`,
      author: user.name,
      authorId: user.id,
      content: newComment,
      createdAt: new Date(),
      replies: [],
    };

    if (replyTo) {
      setComments(prev =>
        prev.map(c =>
          c.id === replyTo
            ? { ...c, replies: [...c.replies, comment] }
            : c
        )
      );
      setReplyTo(null);
    } else {
      setComments(prev => [...prev, comment]);
    }

    setNewComment('');
    alert('댓글이 등록되었습니다');
  };

  const handleDelete = () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    // Load existing posts
    const savedPosts = localStorage.getItem('board_posts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];

    // Remove the post
    const updatedPosts = posts.filter((p: any) => p.id !== postData.id);
    localStorage.setItem('board_posts', JSON.stringify(updatedPosts));

    // Also remove likes data for this post
    const savedLikes = localStorage.getItem('post_likes');
    const likesMap: Record<string, number> = savedLikes ? JSON.parse(savedLikes) : {};
    delete likesMap[postData.id];
    localStorage.setItem('post_likes', JSON.stringify(likesMap));

    // Dispatch event to notify other components
    window.dispatchEvent(new Event('board_updated'));

    alert('게시글이 삭제되었습니다');
    onBack();
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
                <ThumbsUp className="w-4 h-4" />
                {postData.likes}
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
        <div className="p-6 border-t flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              추천 {postData.likes}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Share2 className="w-5 h-5" />
              공유
            </button>
          </div>

          {user && (user.id === postData.authorId || user.role === 'admin') && (
            <div className="flex gap-2">
              {/* 본인이 작성한 게시글이거나, 관리자가 작성한 글인 경우에만 수정 버튼 표시 */}
              {(user.id === postData.authorId) && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
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
          {comments.map(comment => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span>{comment.author}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {comment.createdAt.toLocaleString('ko-KR')}
                  </span>
                </div>
                {user && (
                  <button
                    onClick={() => setReplyTo(comment.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    답글
                  </button>
                )}
              </div>
              <p className="text-gray-700 mb-2">{comment.content}</p>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 mt-3 space-y-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 rounded p-3">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <span className="text-sm">↳ {reply.author}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {reply.createdAt.toLocaleString('ko-KR')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyTo === comment.id && (
                <div className="ml-8 mt-3 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-700 mb-2">답글 작성 중...</p>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comment Form */}
        {user ? (
          <div className="border-t pt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newComment.length} / 500
              </span>
              <button
                onClick={handleComment}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {replyTo ? '답글 등록' : '댓글 등록'}
              </button>
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