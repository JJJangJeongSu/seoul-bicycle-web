import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';
import { PostCreate, Post } from '../../types';

type PostEditorProps = {
  onBack: () => void;
  onSubmit: () => void;
  initialData?: Post;
};

export function PostEditor({ onBack, onSubmit, initialData }: PostEditorProps) {
  const { user } = useAuth();
  const { boardService } = useServices();
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return null;
  }

  const [formData, setFormData] = useState<PostCreate>({
    category: initialData?.category || 'free',
    title: initialData?.title || '',
    content: initialData?.content || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (initialData) {
        await boardService.updatePost(initialData.id, formData);
      } else {
        await boardService.createPost(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = user.role === 'admin'
    ? [
        { id: 'info', label: '정보공유' },
        { id: 'question', label: '질문' },
        { id: 'free', label: '자유' },
        { id: 'notice', label: '공지' },
      ]
    : [
        { id: 'info', label: '정보공유' },
        { id: 'question', label: '질문' },
        { id: 'free', label: '자유' },
      ];

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

      {/* Editor Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl mb-6">{initialData ? '글 수정하기' : '글쓰기'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id as any })}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.category === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="제목을 입력하세요 (최대 100자)"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.title.length} / 100
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="내용을 입력하세요 (최소 10자)"
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.length}자
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {submitting ? (initialData ? '수정 중...' : '등록 중...') : (initialData ? '수정하기' : '등록하기')}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={submitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}