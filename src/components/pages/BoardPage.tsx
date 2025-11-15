import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BoardList } from '../board/BoardList';
import { PostDetail } from '../board/PostDetail';
import { PostEditor } from '../board/PostEditor';
import { useAuth } from '../../contexts/AuthContext';

export function BoardPage() {
  const { user } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleBack = () => {
    setSelectedPostId(null);
    setIsWriting(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      {!selectedPostId && !isWriting && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">게시판</h1>
            <p className="text-gray-600">따릉이 이용 정보를 공유하고 소통하세요</p>
          </div>
          {user && (
            <button
              onClick={() => setIsWriting(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              글쓰기
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {selectedPostId ? (
        <PostDetail postId={selectedPostId} onBack={handleBack} />
      ) : isWriting ? (
        <PostEditor onBack={handleBack} onSubmit={handleBack} />
      ) : (
        <BoardList onPostClick={handlePostClick} />
      )}
    </div>
  );
}
