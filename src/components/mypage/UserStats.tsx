import { useMemo, useState, useEffect } from 'react';
import { Bike, Navigation, Clock, TrendingUp, MapPin } from 'lucide-react';
import { mockRentals, mockStations } from '../../lib/mockData';
import { Rental } from '../../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type UserStatsProps = {
  userId: string;
};

export function UserStats({ userId }: UserStatsProps) {
  const [allRentals, setAllRentals] = useState<Rental[]>([]);

  // Load rental history from localStorage on mount
  useEffect(() => {
    const loadRentalHistory = () => {
      const existingHistory = localStorage.getItem('rental_history');
      const savedRentals: Rental[] = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Convert date strings back to Date objects
      const parsedRentals = savedRentals.map(rental => ({
        ...rental,
        rentalTime: new Date(rental.rentalTime),
        returnTime: rental.returnTime ? new Date(rental.returnTime) : undefined,
      }));
      
      // Combine mock data with saved rentals
      setAllRentals([...mockRentals, ...parsedRentals]);
    };

    loadRentalHistory();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rental_history') {
        loadRentalHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const userRentals = useMemo(() => {
    return allRentals.filter(r => r.userId === userId && r.status === 'returned');
  }, [allRentals, userId]);

  const stats = useMemo(() => {
    const totalRentals = userRentals.length;
    const totalDistance = userRentals.reduce((sum, r) => sum + (r.distance || 0), 0);
    const totalDuration = userRentals.reduce((sum, r) => sum + (r.duration || 0), 0);
    const avgDuration = totalRentals > 0 ? totalDuration / totalRentals : 0;
    const avgDistance = totalRentals > 0 ? totalDistance / totalRentals : 0;

    return {
      totalRentals,
      totalDistance: totalDistance.toFixed(1),
      totalDuration,
      avgDuration: avgDuration.toFixed(1),
      avgDistance: avgDistance.toFixed(1),
    };
  }, [userRentals]);

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { count: number; distance: number }>();
    
    userRentals.forEach(rental => {
      const date = new Date(rental.rentalTime);
      const monthKey = `${date.getMonth() + 1}월`;
      
      const existing = monthMap.get(monthKey) || { count: 0, distance: 0 };
      monthMap.set(monthKey, {
        count: existing.count + 1,
        distance: existing.distance + (rental.distance || 0),
      });
    });

    // Get last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getMonth() + 1}월`;
      const data = monthMap.get(monthKey) || { count: 0, distance: 0 };
      months.push({
        month: monthKey,
        대여횟수: data.count,
        이동거리: parseFloat(data.distance.toFixed(1)),
      });
    }
    
    return months;
  }, [userRentals]);

  // Day of week data
  const dayOfWeekData = useMemo(() => {
    const dayMap = new Map<number, number>();
    
    userRentals.forEach(rental => {
      const date = new Date(rental.rentalTime);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      dayMap.set(dayOfWeek, (dayMap.get(dayOfWeek) || 0) + 1);
    });

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days.map((day, index) => ({
      day,
      이용횟수: dayMap.get(index) || 0,
    }));
  }, [userRentals]);

  // Time of day data
  const timeOfDayData = useMemo(() => {
    const hourMap = new Map<number, number>();
    
    userRentals.forEach(rental => {
      const date = new Date(rental.rentalTime);
      const hour = date.getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    // Group by 3-hour intervals
    const timeSlots = [
      { label: '00-03시', start: 0 },
      { label: '03-06시', start: 3 },
      { label: '06-09시', start: 6 },
      { label: '09-12시', start: 9 },
      { label: '12-15시', start: 12 },
      { label: '15-18시', start: 15 },
      { label: '18-21시', start: 18 },
      { label: '21-24시', start: 21 },
    ];

    return timeSlots.map(slot => {
      let count = 0;
      for (let i = 0; i < 3; i++) {
        count += hourMap.get(slot.start + i) || 0;
      }
      return {
        hour: slot.label,
        이용횟수: count,
      };
    });
  }, [userRentals]);

  // Most used stations
  const mostUsedStations = useMemo(() => {
    const stationMap = new Map<string, number>();
    
    userRentals.forEach(rental => {
      stationMap.set(rental.startStationId, (stationMap.get(rental.startStationId) || 0) + 1);
      if (rental.endStationId) {
        stationMap.set(rental.endStationId, (stationMap.get(rental.endStationId) || 0) + 1);
      }
    });

    const sorted = Array.from(stationMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return sorted.map(([stationId, count]) => {
      const station = mockStations.find(s => s.id === stationId);
      return {
        stationId,
        name: station?.name || stationId,
        count,
      };
    });
  }, [userRentals]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Bike className="w-8 h-8" />
            <span className="text-sm opacity-90">총 대여 횟수</span>
          </div>
          <p className="text-3xl">{stats.totalRentals}회</p>
        </div>

        <div className="bg-green-500 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="w-8 h-8" />
            <span className="text-sm opacity-90">총 이동 거리</span>
          </div>
          <p className="text-3xl">{stats.totalDistance}km</p>
        </div>

        <div className="bg-purple-500 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-sm opacity-90">총 이용 시간</span>
          </div>
          <p className="text-3xl">{stats.totalDuration}분</p>
        </div>

        <div className="bg-orange-500 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm opacity-90">평균 이용 시간</span>
          </div>
          <p className="text-3xl">{stats.avgDuration}분</p>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg mb-4">월별 이용 트렌드</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="대여횟수" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="이동거리" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Day of Week Pattern */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg mb-4">요일별 이용 패턴</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="이용횟수" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Time of Day Pattern */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg mb-4">시간대별 이용 패턴</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeOfDayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="이용횟수" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg mb-4">🎯 평균 통계</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">평균 이용 시간</span>
              <span>{stats.avgDuration}분</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">평균 이동 거리</span>
              <span>{stats.avgDistance}km</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg mb-4">🏆 환경 기여도</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">CO₂ 절감량</span>
              <span>{(parseFloat(stats.totalDistance) * 0.12).toFixed(1)}kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">칼로리 소모량</span>
              <span>{(parseFloat(stats.totalDistance) * 35).toFixed(0)}kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Used Stations */}
      {mostUsedStations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg mb-4">📍 자주 이용하는 대여소</h3>
          <div className="space-y-3">
            {mostUsedStations.map((station, index) => (
              <div
                key={station.stationId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    'bg-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm">{station.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{station.count}회</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}