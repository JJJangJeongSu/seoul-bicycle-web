import { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Eye, ThumbsUp, Pin, Search } from 'lucide-react';
import { mockPosts } from '../../lib/mockData';
import { User } from '../../App';

type Post = {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  isPinned?: boolean;
};

type BoardListProps = {
  onPostClick: (postId: string) => void;
  user: User | null;
};

export function BoardList({ onPostClick, user }: BoardListProps) {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'comments'>('latest');
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    const loadPosts = () => {
      const savedPosts = localStorage.getItem('board_posts');
      const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
      
      // Convert date strings back to Date objects
      const parsedPosts = posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
      }));

      // Load likes data
      const savedLikes = localStorage.getItem('post_likes');
      const likesMap: Record<string, number> = savedLikes ? JSON.parse(savedLikes) : {};

      // Update mock posts with saved likes
      const updatedMockPosts = mockPosts.map(post => ({
        ...post,
        likes: likesMap[post.id] !== undefined ? likesMap[post.id] : post.likes,
      }));
      
      // Combine mock data with saved posts
      setAllPosts([...updatedMockPosts, ...parsedPosts]);
    };

    loadPosts();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'board_posts' || e.key === 'post_likes') {
        loadPosts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCustomUpdate = () => {
      loadPosts();
    };
    window.addEventListener('board_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('board_updated', handleCustomUpdate);
    };
  }, []);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'notice', label: '공지사항' },
    { id: 'info', label: '정보공유' },
    { id: 'question', label: '질문' },
    { id: 'free', label: '자유' },
  ];

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];

    // Category filter
    if (category !== 'all') {
      posts = posts.filter(p => p.category === category);
    }

    // Search filter
    if (searchTerm) {
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    posts.sort((a, b) => {
      if (sortBy === 'latest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === 'popular') {
        return b.views - a.views;
      } else {
        return b.comments - a.comments;
      }
    });

    // Pinned posts first
    return posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [allPosts, category, searchTerm, sortBy]);

  const getCategoryBadge = (cat: string) => {
    const badges = {
      notice: { color: 'bg-red-100 text-red-700', label: '공지사항' },
      info: { color: 'bg-blue-100 text-blue-700', label: '정보공유' },
      question: { color: 'bg-green-100 text-green-700', label: '질문' },
      free: { color: 'bg-gray-100 text-gray-700', label: '자유' },
    };
    return badges[cat as keyof typeof badges] || badges.free;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                category === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 또는 작성자 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="comments">댓글 많은순</option>
        </select>
      </div>

      {/* Post List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredPosts.map(post => {
            const badge = getCategoryBadge(post.category);
            return (
              <div
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && (
                        <Pin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    
                    <h3 className="text-lg mb-1 truncate">
                      {post.title}
                      {post.comments > 0 && (
                        <span className="text-blue-600 text-sm ml-2">
                          [{post.comments}]
                        </span>
                      )}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {post.author} · {formatDate(post.createdAt)}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">게시글이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}