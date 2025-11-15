import { useState } from 'react';
import { Bike, BarChart3, History, Settings, Award } from 'lucide-react';
import { RentalHistory } from '../mypage/RentalHistory';
import { UserStats } from '../mypage/UserStats';
import { UserSettings } from '../mypage/UserSettings';
import { useAuth } from '../../contexts/AuthContext';

export function MyPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  const [activeTab, setActiveTab] = useState<'history' | 'stats' | 'settings'>('history');

  const tabs = [
    { id: 'history', label: '대여 이력', icon: History },
    { id: 'stats', label: '이용 통계', icon: BarChart3 },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Bike className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl mb-1">{user.name}님</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="text-right">
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg inline-block">
              <Award className="w-5 h-5 inline mr-1" />
              {user.role === 'admin' ? '관리자' : '일반 회원'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex gap-2 p-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'history' | 'stats' | 'settings')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'history' && <RentalHistory userId={user.id} />}
          {activeTab === 'stats' && <UserStats userId={user.id} />}
          {activeTab === 'settings' && <UserSettings user={user} />}
        </div>
      </div>
    </div>
  );
}
