import { useState } from 'react';
import { Users, Bike, MapPin, Wrench, BarChart3 } from 'lucide-react';
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminUsers } from '../admin/AdminUsers';
import { AdminStations } from '../admin/AdminStations';
import { AdminBikes } from '../admin/AdminBikes';
import { AdminRepairs } from '../admin/AdminRepairs';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'stations' | 'bikes' | 'repairs'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: '대시보드', icon: BarChart3 },
    { id: 'users', label: '회원 관리', icon: Users },
    { id: 'stations', label: '대여소 관리', icon: MapPin },
    { id: 'bikes', label: '자전거 관리', icon: Bike },
    { id: 'repairs', label: '고장 처리', icon: Wrench },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">관리자 페이지</h1>
        <p className="text-gray-600">시스템 관리 및 통계를 확인하세요</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
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
      <div>
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'stations' && <AdminStations />}
        {activeTab === 'bikes' && <AdminBikes />}
        {activeTab === 'repairs' && <AdminRepairs />}
      </div>
    </div>
  );
}