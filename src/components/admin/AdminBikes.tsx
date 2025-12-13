import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, RefreshCw, Search, History, Clock } from 'lucide-react';
import { 
  getAllBikes, 
  createBike, 
  updateBikeStatus, 
  deleteBike,
  getBikeRentalRecords,
  getAllStations, 
  type Bike,
  type Station,
  type Pagination,
  type Rental
} from '../../services/admin.service';

export function AdminBikes() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Edit State
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  
  // Add State
  const [isAdding, setIsAdding] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // History State
  const [viewingHistoryBike, setViewingHistoryBike] = useState<Bike | null>(null);
  const [rentalRecords, setRentalRecords] = useState<Rental[]>([]);
  const [historyPagination, setHistoryPagination] = useState<Pagination | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const fetchBikes = async (page: number, search?: string) => {
    try {
      setLoading(true);
      const { bikes: fetchedBikes, pagination: fetchedPagination } = await getAllBikes(page, 10, search);
      setBikes(fetchedBikes);
      setPagination(fetchedPagination);
    } catch (error) {
      console.error('Failed to fetch bikes:', error);
      alert('자전거 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBikes(1, searchTerm);
  };

  // Load stations when opening add modal
  useEffect(() => {
    if (isAdding && stations.length === 0) {
      getAllStations(1, 100).then(data => {
        setStations(data.stations);
        if (data.stations.length > 0) {
          setSelectedStationId(data.stations[0].id);
        }
      });
    }
  }, [isAdding]);

  useEffect(() => {
    if (viewingHistoryBike) {
      fetchHistory(viewingHistoryBike.id, historyPage);
    }
  }, [historyPage, viewingHistoryBike?.id]);

  const fetchHistory = async (bikeId: string, page: number) => {
    try {
      setHistoryLoading(true);
      const { records, pagination } = await getBikeRentalRecords(bikeId, page, 10);
      setRentalRecords(records);
      setHistoryPagination(pagination);
    } catch (error) {
      console.error('Failed to fetch rental records:', error);
      alert('대여 이력을 불러오는데 실패했습니다.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = (bike: Bike) => {
    setViewingHistoryBike(bike);
    setHistoryPage(1);
    // fetchHistory called by useEffect
  };

  const handleEdit = (bike: Bike) => {
    setEditingBike(bike);
  };

  const handleSaveEdit = async (newStatus: 'available' | 'rented' | 'maintenance' | 'broken') => {
    if (!editingBike) return;

    try {
      await updateBikeStatus(editingBike.id, newStatus);
      setBikes(bikes.map(b => 
        b.id === editingBike.id 
          ? { ...b, status: newStatus as any }
          : b
      ));
      setEditingBike(null);
      alert('자전거 상태가 변경되었습니다');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (bike: Bike) => {
    const confirmed = window.confirm(`정말로 자전거 ${bike.id}를 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await deleteBike(bike.id);
      setBikes(bikes.filter(b => b.id !== bike.id));
      alert('자전거가 삭제되었습니다');
    } catch (error) {
      console.error('Failed to delete bike:', error);
      alert('자전거 삭제에 실패했습니다.');
    }
  };

  const handleAddBike = async () => {
    if (!selectedStationId) {
      alert('대여소를 선택해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createBike(selectedStationId);
      alert('자전거가 추가되었습니다.');
      setIsAdding(false);
      fetchBikes(currentPage); // Refresh list
    } catch (error) {
      console.error('Failed to create bike:', error);
      alert('자전거 추가에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  if (loading && bikes.length === 0) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">자전거 관리</h2>
        <div className="flex gap-2">
           <button 
            onClick={() => fetchBikes(currentPage)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="새로고침"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="자전거 번호 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 absolute left-2.5 top-3 text-gray-500" />
            <button type="submit" className="hidden">Search</button>
          </form>

          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            자전거 추가
          </button>
        </div>
      </div>

      {/* Bike List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">자전거 번호</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">현재 위치(ID)</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">이용 횟수</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">생성일</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bikes.map(bike => (
                <tr key={bike.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">
                    <button 
                      onClick={() => handleOpenHistory(bike)}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 group"
                    >
                      {bike.id}
                      <History className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bike.current_station_id || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      bike.status === 'available' ? 'bg-green-100 text-green-700' :
                      bike.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                      (bike.status as string) === 'broken' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {bike.status === 'available' ? '정상' :
                       bike.status === 'rented' ? '대여중' : 
                       (bike.status as string) === 'broken' ? '고장/폐기' : '점검중'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{bike.use_count}회</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(bike.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(bike)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(bike)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded" 
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bikes.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    등록된 자전거가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBike && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">자전거 상태 변경</h3>
              <button 
                onClick={() => setEditingBike(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              자전거 번호: <span className="font-mono font-bold">{editingBike.id}</span>
            </p>

            <div className="space-y-2">
              {[
                { value: 'available', label: '✅ 정상 (대여 가능)', color: 'green' },
                { value: 'rented', label: '🚴 대여중', color: 'blue' },
                { value: 'maintenance', label: '🔧 점검중', color: 'orange' },
                { value: 'broken', label: '❌ 고장/폐기', color: 'red' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSaveEdit(option.value as any)}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-colors border ${
                    editingBike.status === option.value
                      ? `bg-${option.color}-50 border-${option.color}-500 ring-1 ring-${option.color}-500`
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={((editingBike.status as string) === 'maintenence' && option.value === 'maintenance') || editingBike.status === option.value ? `text-${option.color}-700 font-medium` : 'text-gray-700'}>
                      {option.label}
                    </span>
                    {(((editingBike.status as string) === 'maintenence' && option.value === 'maintenance') || editingBike.status === option.value) && <span className="text-xs text-gray-500">(현재)</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setEditingBike(null)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">자전거 추가</h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배치할 대여소
              </label>
              {stations.length > 0 ? (
                <select 
                  className="w-full border rounded-lg p-2"
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(e.target.value)}
                >
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} (현재 {station.bike_count}/{station.capacity})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-500">대여소 목록을 불러오는 중...</div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleAddBike}
                disabled={isSubmitting || !selectedStationId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? '추가 중...' : '추가하기'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* History Modal */}
      {viewingHistoryBike && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                대여 이력 - {viewingHistoryBike.id}
              </h3>
              <button 
                onClick={() => setViewingHistoryBike(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {historyLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500">불러오는 중...</div>
                </div>
              ) : rentalRecords.length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">대여 시간</th>
                        <th className="px-4 py-2 text-left">대여소</th>
                        <th className="px-4 py-2 text-left">반납 시간</th>
                        <th className="px-4 py-2 text-left">반납 대여소</th>
                        <th className="px-4 py-2 text-left">상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rentalRecords.map(record => (
                        <tr key={record.id}>
                          <td className="px-4 py-3">{record.rental_time ? new Date(record.rental_time).toLocaleString() : '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{record.start_station_id}</td>
                          <td className="px-4 py-3">{record.return_time ? new Date(record.return_time).toLocaleString() : '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{record.end_station_id || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.status === 'rented' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {record.status === 'rented' ? '대여중' : '반납완료'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  대여 이력이 없습니다.
                </div>
              )}
            </div>

            {/* History Pagination */}
            {historyPagination && historyPagination.totalPages > 1 && (
              <div className="mt-4 pt-4 border-t flex justify-center gap-2">
                <button
                  onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                  disabled={!historyPagination.hasPrev}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                >
                  이전
                </button>
                <span className="text-sm text-gray-600 self-center">
                  {historyPagination.currentPage} / {historyPagination.totalPages}
                </span>
                <button
                  onClick={() => setHistoryPage(p => Math.min(historyPagination.totalPages, p + 1))}
                  disabled={!historyPagination.hasNext}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}