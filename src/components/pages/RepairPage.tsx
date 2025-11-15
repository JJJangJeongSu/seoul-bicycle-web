import { useState } from 'react';
import { User } from '../../App';
import { Plus, List } from 'lucide-react';
import { RepairForm } from '../repair/RepairForm';
import { RepairList } from '../repair/RepairList';

type RepairPageProps = {
  user: User | null;
  onLoginRequired: () => void;
};

export function RepairPage({ user, onLoginRequired }: RepairPageProps) {
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');

  const handleCreateReport = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    setActiveView('form');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">고장 신고</h1>
          <p className="text-gray-600">자전거나 대여소의 문제를 신고해주세요</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
            신고 내역
          </button>
          <button
            onClick={handleCreateReport}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'form'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-5 h-5" />
            신고하기
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'form' ? (
        <RepairForm
          user={user!}
          onSuccess={() => setActiveView('list')}
          onCancel={() => setActiveView('list')}
        />
      ) : (
        <RepairList user={user} />
      )}
    </div>
  );
}
