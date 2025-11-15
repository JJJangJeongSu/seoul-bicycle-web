import { Bike, MapPin, Clock } from 'lucide-react';
import { Station, User, Rental } from '../../App';
import { useState } from 'react';

type ListViewProps = {
  stations: Station[];
  onStationClick: (station: Station) => void;
  user?: User | null;
  currentRental?: Rental | null;
  onRent?: (stationId: string) => void;
  onLoginRequired?: () => void;
};

export function ListView({ stations, onStationClick, user, currentRental, onRent, onLoginRequired }: ListViewProps) {
  const [sortBy, setSortBy] = useState<'name' | 'bikes-desc' | 'bikes-asc'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sort stations
  const sortedStations = [...stations].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'bikes-desc') {
      return b.bikeCount - a.bikeCount;
    } else {
      return a.bikeCount - b.bikeCount;
    }
  });

  // Paginate
  const totalPages = Math.ceil(sortedStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStations = sortedStations.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (station: Station) => {
    if (station.status === 'inactive') {
      return <span className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full shadow-sm">⏸️ 운영중지</span>;
    }
    if (station.bikeCount === 0) {
      return <span className="px-3 py-1.5 text-xs bg-primary/20 text-primary rounded-full shadow-sm">❌ 대여불가</span>;
    }
    if (station.bikeCount <= 4) {
      return <span className="px-3 py-1.5 text-xs bg-chart-4/30 text-accent-foreground rounded-full shadow-sm">⚠️ 여유부족</span>;
    }
    return <span className="px-3 py-1.5 text-xs bg-accent/30 text-accent-foreground rounded-full shadow-sm">✨ 대여여유</span>;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-sky-200">
      {/* Sort Controls */}
      <div className="bg-muted p-5 border-b-4 border-sky-200 flex items-center gap-4">
        <span className="text-sm text-gray-700">🔄 정렬:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'bikes-desc' | 'bikes-asc')}
          className="px-4 py-2 border-2 border-sky-200 rounded-full focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white shadow-sm"
        >
          <option value="name">📍 대여소명 (가나다순)</option>
          <option value="bikes-desc">🚲 자전거 수 (많은순)</option>
          <option value="bikes-asc">🚲 자전거 수 (적은순)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                대여소명
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                주소
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                자전거 수
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStations.map((station) => (
              <tr
                key={station.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onStationClick(station)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{station.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{station.address}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Bike className={`w-5 h-5 ${
                      station.bikeCount === 0 ? 'text-red-500' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${
                      station.bikeCount === 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {station.bikeCount}대
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(station)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStationClick(station);
                      }}
                      className="px-4 py-2 bg-secondary text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
                    >
                      상세보기
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          onLoginRequired?.();
                          return;
                        }
                        if (currentRental) {
                          alert('이미 대여 중인 자전거가 있습니다. 먼저 반납해주세요.');
                          return;
                        }
                        if (station.bikeCount === 0 || station.status === 'inactive') {
                          alert('현재 대여 가능한 자전거가 없습니다.');
                          return;
                        }
                        onRent?.(station.id);
                      }}
                      disabled={!user || !!currentRental || station.bikeCount === 0 || station.status === 'inactive'}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      대여하기
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            전체 {stations.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, stations.length)}개 표시
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedStations.length === 0 && (
        <div className="p-12 text-center">
          <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">검색 결과가 없습니다</p>
          <p className="text-sm text-gray-400 mt-2">다른 검색어나 필터를 사용해보세요</p>
        </div>
      )}
    </div>
  );
}
