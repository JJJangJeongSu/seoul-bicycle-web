import { useState, useEffect } from 'react';
import { Users, Bike, MapPin, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useServices } from '../../hooks/useServices';
import { AdminStatistics } from '../../../CodeGenerator/models';

export function AdminDashboard() {
  const { adminService } = useServices();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load statistics on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load statistics:', err);
        setError('통계 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [adminService]);

  // Transform time_population for chart
  // Assuming time_population is [[{time: 0, usage: 10}, ...]]
  // API returns Array<Array<...>>, likely representing different days or aggregates. We take the first one for "today".
  const hourlyData = stats?.time_population?.[0]?.map(item => ({
    hour: item.time.toString().padStart(2, '0'),
    이용: item.usage
  })) || [];

  // Transform popular stations for chart (Top 5 Monthly or Weekly)
  const popularStationsData = stats?.popular_stations?.monthly?.slice(0, 5).map(station => ({
    name: station.name,
    count: station.count
  })) || [];

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // Show error state
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-destructive mb-4 text-xl">⚠️</div>
        <p className="text-gray-600 mb-4">{error || '데이터가 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <span className="text-2xl opacity-80">👥</span>
          </div>
          <p className="text-sm opacity-90 mb-1">총 회원 수</p>
          <p className="text-3xl">{stats.total_users.toLocaleString()}</p>
        </div>

        <div className="bg-green-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Bike className="w-10 h-10 opacity-80" />
            <span className="text-2xl opacity-80">🚲</span>
          </div>
          <p className="text-sm opacity-90 mb-1">총 자전거</p>
          <p className="text-3xl">{stats.total_bikes.toLocaleString()}</p>
        </div>

        <div className="bg-purple-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <span className="text-2xl opacity-80">📈</span>
          </div>
          <p className="text-sm opacity-90 mb-1">오늘 대여</p>
          <p className="text-3xl">{stats.today_rentals_today.toLocaleString()}</p>
        </div>

        <div className="bg-orange-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="w-10 h-10 opacity-80" />
            <span className="text-2xl opacity-80">📍</span>
          </div>
          <p className="text-sm opacity-90 mb-1">현재 대여중</p>
          <p className="text-3xl">{stats.active_rentals.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg mb-4">📊 최근 활동</h3>
        <div className="space-y-3">
          {stats.recent_activities && stats.recent_activities.length > 0 ? (
            stats.recent_activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.category === 'rental' ? 'bg-green-500' :
                    activity.category === 'return' ? 'bg-blue-500' :
                    activity.category === 'repair' ? 'bg-yellow-500' :
                    activity.category === 'registeration' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm">{activity.content}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">최근 활동이 없습니다.</p>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Bike Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="mb-4">🚲 자전거 현황</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">정상 (대여가능)</span>
              <span>{stats.bike_status.available.toLocaleString()}대</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.bike_status.available / stats.total_bikes * 100) || 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">대여중</span>
              <span>{stats.bike_status.rented.toLocaleString()}대</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(stats.bike_status.rented / stats.total_bikes * 100) || 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">고장/수리</span>
              <span>{stats.bike_status.maintenence.toLocaleString()}대</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(stats.bike_status.maintenence / stats.total_bikes * 100) || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Station Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="mb-4">📍 대여소 현황</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">운영중</span>
              <span>{stats.station_status.active.toLocaleString()}개</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.station_status.active / stats.total_stations * 100) || 0}%` }}
              ></div>
            </div>
             <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">중단/폐쇄</span>
              <span>{stats.station_status.inactive.toLocaleString()}개</span>
            </div>
             <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-500 h-2 rounded-full" 
                style={{ width: `${(stats.station_status.inactive / stats.total_stations * 100) || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Repair Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="mb-4">🔧 고장 신고</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">처리 대기</span>
              <span>{stats.repair_status.pending.toLocaleString()}건</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(stats.repair_status.pending / stats.total_repairs_pending * 100) || 0}%` }}
              ></div>
            </div>

             <div className="flex justify-between text-sm">
              <span className="text-gray-600">진행중</span>
              <span>{stats.repair_status['in-progress'].toLocaleString()}건</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${(stats.repair_status['in-progress'] / stats.total_repairs_pending * 100) || 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">완료(오늘)</span>
              <span>{stats.repair_status.completed.toLocaleString()}건</span>
            </div>
             <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: '100%' }} // Completed is accumulative, simplified visual
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
