import { useState, useEffect } from 'react';
import { Users, Bike, MapPin, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useServices } from '../../hooks/useServices';
import { AdminStatistics } from '../../../CodeGenerator/models';

export function AdminDashboard() {
  const { adminService } = useServices();
  const [stats, setStats] = useState<AdminStatistics>({
    total_users: 0,
    total_stations: 0,
    total_bikes: 0,
    active_rentals: 0,
    today_rentals_today: 0,
    total_repairs_pending: 0,
  });
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

  const monthlyData = [
    { month: '1월', 대여: 7200 },
    { month: '2월', 대여: 7800 },
    { month: '3월', 대여: 8400 },
    { month: '4월', 대여: 9200 },
    { month: '5월', 대여: 8900 },
    { month: '6월', 대여: 8956 },
  ];

  const hourlyData = [
    { hour: '00', 이용: 45 },
    { hour: '03', 이용: 12 },
    { hour: '06', 이용: 89 },
    { hour: '09', 이용: 234 },
    { hour: '12', 이용: 189 },
    { hour: '15', 이용: 156 },
    { hour: '18', 이용: 312 },
    { hour: '21', 이용: 178 },
  ];

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
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-destructive mb-4 text-xl">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
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
          <p className="text-sm opacity-90 mb-1">총 대여소</p>
          <p className="text-3xl">{stats.total_stations.toLocaleString()}</p>
        </div>

        <div className="bg-purple-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <span className="text-2xl opacity-80">📈</span>
          </div>
          <p className="text-sm opacity-90 mb-1">총 자전거</p>
          <p className="text-3xl">{stats.total_bikes.toLocaleString()}</p>
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

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg mb-4">월별 대여 트렌드</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="대여" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg mb-4">시간대별 이용량</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="이용" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg mb-4">📊 최근 활동</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">홍길동님이 자전거를 대여했습니다</span>
            </div>
            <span className="text-sm text-gray-500">5분 전</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">김철수님이 자전거를 반납했습니다</span>
            </div>
            <span className="text-sm text-gray-500">12분 전</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">새로운 고장 신고가 접수되었습니다</span>
            </div>
            <span className="text-sm text-gray-500">23분 전</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">이영희님이 회원가입했습니다</span>
            </div>
            <span className="text-sm text-gray-500">1시간 전</span>
          </div>
        </div>
      </div>

      {/* System Status - Placeholder data for now */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="mb-4">🚲 자전거 현황</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">정상</span>
              <span>{(stats.total_bikes * 0.85).toFixed(0)}대 (85%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">대여중</span>
              <span>{stats.active_rentals}대 ({(stats.active_rentals / stats.total_bikes * 100).toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.active_rentals / stats.total_bikes * 100)}%` }}></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">고장/수리</span>
              <span>{stats.total_repairs_pending}대</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="mb-4">📍 대여소 현황</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">운영중</span>
              <span>{stats.total_stations}개 (100%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="mb-4">🔧 고장 신고</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">처리 대기</span>
              <span>{stats.total_repairs_pending}건</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
