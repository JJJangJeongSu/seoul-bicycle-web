import { useState, useMemo, useEffect } from 'react';
import { MapPin, Clock, Navigation, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockRentals, mockStations } from '../../lib/mockData';
import { Rental } from '../../App';

type RentalHistoryProps = {
  userId: string;
};

export function RentalHistory({ userId }: RentalHistoryProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

    // Optional: Listen for storage changes (if multiple tabs are open)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rental_history') {
        loadRentalHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredRentals = useMemo(() => {
    let rentals = allRentals.filter(r => r.userId === userId && r.status === 'returned');

    // Filter by period
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      rentals = rentals.filter(r => r.rentalTime >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      rentals = rentals.filter(r => r.rentalTime >= monthAgo);
    }

    // Sort
    rentals.sort((a, b) => {
      if (sortOrder === 'latest') {
        return b.rentalTime.getTime() - a.rentalTime.getTime();
      } else {
        return a.rentalTime.getTime() - b.rentalTime.getTime();
      }
    });

    return rentals;
  }, [allRentals, userId, period, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [period, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRentals = filteredRentals.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStationName = (stationId: string) => {
    const station = mockStations.find(s => s.id === stationId);
    return station?.name || stationId;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return {
      dateLine: `${year}년 ${month}월 ${day}일`,
      timeLine: `${period} ${displayHours}:${displayMinutes}`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'week'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            최근 7일
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'month'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            최근 30일
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'all'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          총 <span className="text-xl mx-1">{filteredRentals.length}</span>건의 이용 기록
        </p>
      </div>

      {/* Rental List */}
      <div className="space-y-4">
        {currentRentals.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">이용 기록이 없습니다</p>
          </div>
        ) : (
          currentRentals.map((rental) => (
            <div
              key={rental.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-sm text-gray-600">대여 번호</span>
                  <p>{rental.id}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                  반납 완료
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">출발</p>
                    <p className="text-sm truncate">{getStationName(rental.startStationId)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">도착</p>
                    <p className="text-sm truncate">{getStationName(rental.endStationId!)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    대여 시간
                  </div>
                  <p className="text-sm">{formatDate(rental.rentalTime).dateLine}</p>
                  <p className="text-sm">{formatDate(rental.rentalTime).timeLine}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    반납 시간
                  </div>
                  <p className="text-sm">{rental.returnTime ? formatDate(rental.returnTime).dateLine : '-'}</p>
                  <p className="text-sm">{rental.returnTime ? formatDate(rental.returnTime).timeLine : '-'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    이용 시간
                  </div>
                  <p className="text-sm">{rental.duration}분</p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Navigation className="w-4 h-4" />
                    이동 거리
                  </div>
                  <p className="text-sm">{rental.distance}km</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 py-2 rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-3 py-2 rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}