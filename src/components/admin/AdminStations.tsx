import { useState, useEffect } from 'react';
import { Plus, Edit, Power, X, Search, ChevronLeft, ChevronRight, Loader2, Trash, Eye, MapPin, Bike as BikeIcon } from 'lucide-react';
import { Station, CreateStation, StationStatusEnum, Bike } from '../../../CodeGenerator';
import { getAllStations, createStation, updateStation, deleteStation, getStationById } from '../../services/admin.service';

export function AdminStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [viewingStation, setViewingStation] = useState<Station | null>(null);
  const [stationBikes, setStationBikes] = useState<Bike[]>([]); // New state for bikes
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // Loading state for details
  const [isAddingStation, setIsAddingStation] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CreateStation model: name, address, latitude, longitude, capacity
  const [newStation, setNewStation] = useState<CreateStation>({
    name: '',
    address: '',
    latitude: '37.5665', // Default center
    longitude: '126.9780',
    capacity: 10 // Default capacity
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchStations(pagination.currentPage, debouncedSearch);
  }, [pagination.currentPage, debouncedSearch]);

  const fetchStations = async (page: number, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStations(page, 10, search);
      setStations(data.stations);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        itemsPerPage: data.pagination.itemsPerPage,
        hasNext: data.pagination.hasNext,
        hasPrev: data.pagination.hasPrev
      });
    } catch (error) {
      console.error("Failed to fetch stations", error);
      setError('대여소 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
  };

  const handleView = async (station: Station) => {
    setViewingStation(station);
    setStationBikes([]); // Reset bikes
    setIsLoadingDetails(true);
    
    try {
      const details = await getStationById(station.id);
      if (details) {
        setViewingStation(details.station_info); // Update with fresh info
        setStationBikes(details.bikes);
      }
    } catch (err) {
      console.error("Failed to fetch station details", err);
      // Keep showing basic info if fetch fails, but maybe alert user?
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingStation) return;

    if (!editingStation.name || !editingStation.address) {
      alert('대여소명과 주소를 입력해주세요');
      return;
    }

    try {
      await updateStation(editingStation.id, {
        name: editingStation.name,
        address: editingStation.address,
        latitude: editingStation.latitude,
        longitude: editingStation.longitude,
        // bike_count is read only from station perspective usually, but if update allows it:
        // UpdateStation model might differ. Assuming general update.
        bike_count: editingStation.bike_count, 
        total_racks: editingStation.capacity,
        status: editingStation.status
      } as any); // Type cast until UpdateStation is fully verified/aligned
      
      await fetchStations(pagination.currentPage, debouncedSearch);
      setEditingStation(null);
      alert('대여소 정보가 수정되었습니다');
    } catch (error) {
      console.error("Failed to update station", error);
      alert("대여소 수정 중 오류가 발생했습니다.");
    }
  };

  const handleToggleStatus = async (station: Station) => {
    const newStatus = station.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'inactive' ? '폐쇄' : '재개장';
    
    const confirmed = window.confirm(`정말로 ${station.name} 대여소를 ${action}하시겠습니까?`);
    if (!confirmed) return;

    try {
      await updateStation(station.id, {
        ...station,
        status: newStatus as StationStatusEnum
      } as any);
      await fetchStations(pagination.currentPage, debouncedSearch);
      alert(`${station.name} 대여소가 ${action}되었습니다`);
    } catch (error) {
       console.error("Failed to toggle status", error);
       alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (station: Station) => {
    if(!window.confirm(`정말로 ${station.name} 대여소를 삭제하시겠습니까?`)) return;
    try {
      await deleteStation(station.id);
      await fetchStations(pagination.currentPage, debouncedSearch);
    } catch (error) {
      console.error("Failed to delete", error);
      alert("삭제 실패");
    }
  }

  const handleAddStationSubmit = async () => {
    if (!newStation.name || !newStation.address) {
      alert('대여소명과 주소를 입력해주세요');
      return;
    }

    try {
      await createStation(newStation);
      await fetchStations(pagination.currentPage, debouncedSearch);
      setIsAddingStation(false);
      
      // Reset form
      setNewStation({
        name: '',
        address: '',
        latitude: '37.5665', 
        longitude: '126.9780',
        capacity: 10
      });
      
      alert(`새 대여소가 추가되었습니다`);
    } catch (error) {
      console.error("Failed to create station", error);
      alert("대여소 추가 실패");
    }
  };

  // Show loading state
  if (loading && stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600">대여소 목록을 불러오는 중...</p>
      </div>
    );
  }

  // Show error state
  if (error && stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-destructive mb-4 text-xl">⚠️</div>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar: Search and Add Button */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="대여소명, 주소로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setIsAddingStation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            대여소 추가
          </button>
        </div>
      </div>

      {/* Station List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">대여소명</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">주소</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">자전거 수</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stations?.map(station => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{station.id}</td>
                  <td className="px-6 py-4 text-sm">{station.name}</td>
                  <td className="px-6 py-4 text-sm">{station.address}</td>
                  <td className="px-6 py-4 text-sm">{station.bike_count}대</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      station.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {station.status === 'active' ? '운영중' : '폐쇄'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleView(station)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(station)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded" 
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(station)}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded" 
                        title="상태 변경"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(station)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded" 
                        title="삭제"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              총 {pagination.totalItems}개 중 {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}개 표시
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const current = pagination.currentPage;
                  return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 2;
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 py-1">...</span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded ${
                        pagination.currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">대여소 정보 수정</h3>
              <button 
                onClick={() => setEditingStation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">대여소 ID</label>
                <input
                  type="text"
                  value={editingStation.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">대여소명 *</label>
                <input
                  type="text"
                  value={editingStation.name}
                  onChange={(e) => setEditingStation({ ...editingStation, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="대여소명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">주소 *</label>
                <input
                  type="text"
                  value={editingStation.address}
                  onChange={(e) => setEditingStation({ ...editingStation, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="주소를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">자전거 수</label>
                <input
                  type="number"
                  value={editingStation.bike_count}
                  onChange={(e) => setEditingStation({ ...editingStation, bike_count: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">총 거치대 수 (Capacity)</label>
                <input
                  type="number"
                  value={editingStation.capacity || 0}
                  onChange={(e) => setEditingStation({ ...editingStation, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingStation(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Station Modal */}
      {isAddingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">새 대여소 추가</h3>
              <button 
                onClick={() => {
                  setIsAddingStation(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">대여소명 *</label>
                <input
                  type="text"
                  value={newStation.name}
                  onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="대여소명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">주소 *</label>
                <input
                  type="text"
                  value={newStation.address}
                  onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="주소를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">최대 수용 대수 (Capacity)</label>
                <input
                  type="number"
                  value={newStation.capacity}
                  onChange={(e) => setNewStation({ ...newStation, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="10"
                />
              </div>
              

              {/* 위도 경도 입력 */}
              <div className="bg-blue-50 rounded-lg p-3">
                <label className="block text-sm text-gray-600 mb-1">위도 *</label>
                <input
                  type="number"
                  value={newStation.latitude}
                  onChange={(e) => setNewStation({ ...newStation, latitude: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="37.5"
                />
                <label className="block text-sm text-gray-600 mb-1">경도 *</label>
                <input
                  type="number"
                  value={newStation.longitude}
                  onChange={(e) => setNewStation({ ...newStation, longitude: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="127.0"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddStationSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setIsAddingStation(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Detail Modal */}
      {viewingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-xl">대여소 상세 정보</h3>
              <button 
                onClick={() => setViewingStation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isLoadingDetails ? (
              <div className="flex flex-col items-center justify-center py-12">
                 <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                 <p className="text-gray-500">상세 정보를 불러오는 중...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">{viewingStation.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        viewingStation.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {viewingStation.status === 'active' ? '운영중' : '폐쇄'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">대여소 ID</span>
                      <span className="font-medium">{viewingStation.id}</span>
                    </div>
                    
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">주소</span>
                      <span className="font-medium text-right text-sm">{viewingStation.address}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">보유 자전거</span>
                      <div className="flex items-center gap-1">
                        <BikeIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{viewingStation.bike_count}대</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">총 거치대</span>
                      <span className="font-medium">{viewingStation.capacity}개</span>
                    </div>
                  </div>
                </div>

                {/* Bikes List */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <BikeIcon className="w-4 h-4" />
                    주차된 자전거 목록 ({stationBikes.length})
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">자전거 ID</th>
                          <th className="px-4 py-2 text-left">상태</th>
                          <th className="px-4 py-2 text-left">이용 횟수</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {stationBikes.length > 0 ? (
                          stationBikes.map((bike) => (
                            <tr key={bike.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2">{bike.id}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  bike.status === 'available' ? 'bg-green-100 text-green-700' : 
                                  bike.status === 'maintenence' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {bike.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-gray-600">{bike.use_count || 0}회</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                              주차된 자전거가 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-4">
                  <button
                    onClick={() => {
                      setViewingStation(null);
                      handleEdit(viewingStation);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    대여소 수정
                  </button>
                  <button
                    onClick={() => setViewingStation(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}