import { useState, useEffect } from 'react';
import { Plus, Edit, Power, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Station, Pagination } from '../../types';
import { useServices } from '../../hooks/useServices';

export function AdminStations() {
  const { adminService } = useServices()
  const [stations, setStations] = useState<Station[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNext: false,
    hasPrev: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isAddingStation, setIsAddingStation] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    capacity: 0,
  });

  const fetchStations = async (page: number, search: string) => {
    try {
      const { stations, pagination } = await adminService.getAllStations(page, 20, search);
      setStations(stations);
      setPagination(pagination);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    }
  };

  useEffect(() => {
    fetchStations(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStations(1, searchQuery);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
  };

  const handleSaveEdit = async () => {
    if (!editingStation) return;

    if (!editingStation.name || !editingStation.address) {
      alert('대여소명과 주소를 입력해주세요');
      return;
    }

    if (!editingStation.id) {
      alert('대여소 ID가 없습니다. 새로고침 후 다시 시도해주세요.');
      return;
    }

    try {
      await adminService.updateStation(editingStation.id, editingStation);
      
      // Refresh list
      fetchStations(currentPage, searchQuery);
      setEditingStation(null);
      alert('대여소 정보가 수정되었습니다');
    } catch (error) {
      console.error('Failed to update station:', error);
      alert('대여소 정보 수정에 실패했습니다.');
    }
  };

  const handleToggleStatus = async (station: Station) => {
    const newStatus = station.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'inactive' ? '폐쇄' : '재개장';
    
    if (!station.id) {
      alert('대여소 ID가 없습니다.');
      return;
    }

    const confirmed = window.confirm(`정말로 ${station.name} 대여소를 ${action}하시겠습니까?`);
    if (!confirmed) return;

    try {
      await adminService.updateStation(station.id, { ...station, status: newStatus });

      // Refresh list
      fetchStations(currentPage, searchQuery);
      
      alert(`${station.name} 대여소가 ${action}되었습니다`);
    } catch (error) {
      console.error('Failed to toggle station status:', error);
      alert(`대여소 ${action}에 실패했습니다.`);
    }
  };

  const handleDeleteStation = async (station: Station) => {
    if (!station.id) {
      alert('대여소 ID가 없습니다.');
      return;
    }

    const confirmed = window.confirm(`정말로 ${station.name} 대여소를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`);
    if (!confirmed) return;

    try {
      await adminService.deleteStation(station.id);
      
      // Refresh list
      fetchStations(currentPage, searchQuery);
      alert(`${station.name} 대여소가 삭제되었습니다`);
    } catch (error) {
      console.error('Failed to delete station:', error);
      alert('대여소 삭제에 실패했습니다.');
    }
  };

  const handleAddStation = async () => {
    if (!newStation.name || !newStation.address) {
      alert('대여소명과 주소를 입력해주세요');
      return;
    }

    // id 는 server에서 자동 할당
    // bikecount는 0에서 시작
    const station: Station = {  
      id: '',
      name: newStation.name,
      address: newStation.address,
      latitude: newStation.latitude,
      longitude: newStation.longitude,
      capacity: newStation.capacity,
      bikeCount: 0,
      status: 'active',
    };


    // API 호출
    try {
      await adminService.createStation(station);

      // Refresh list
      fetchStations(currentPage, searchQuery);

      setIsAddingStation(false);
      setNewStation({ name: '', address: '', capacity: 0, latitude: 0, longitude: 0 });
      alert(`새 대여소 ${station.name}가 추가되었습니다`);
    } catch (error) {
      console.error('Failed to create station:', error);
      alert('대여소 추가에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-64">
          <input
            type="text"
            placeholder="대여소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </form>
        <button 
          onClick={() => setIsAddingStation(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          대여소 추가
        </button>
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
              {stations.map(station => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{station.id}</td>
                  <td className="px-6 py-4 text-sm">{station.name}</td>
                  <td className="px-6 py-4 text-sm">{station.address}</td>
                  <td className="px-6 py-4 text-sm">{station.bikeCount}대</td>
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
                        onClick={() => handleEdit(station)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
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
                        onClick={() => handleDeleteStation(station)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded" 
                        title="삭제"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            총 {pagination.totalItems}개 중 {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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
                <label className="block text-sm text-gray-600 mb-1">자전거 최대 수용량</label>
                <input
                  type="number"
                  value={editingStation.capacity}
                  onChange={(e) => setEditingStation({ ...editingStation, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">상태 *</label>
                <select
                  value={editingStation.status}
                  onChange={(e) => setEditingStation({ ...editingStation, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
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
                  setNewStation({ name: '', address: '', capacity: 0, latitude: 0, longitude: 0 });
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
                <label className="block text-sm text-gray-600 mb-1">위도</label>
                <input
                  type="number"
                  value={newStation.latitude}
                  onChange={(e) => setNewStation({ ...newStation, latitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="-90"
                  max="90"
                  step="0.0001"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">경도</label>
                <input
                  type="number"
                  value={newStation.longitude}
                  onChange={(e) => setNewStation({ ...newStation, longitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="-180"
                  max="180"
                  step="0.0001"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">자전거 최대 수용량</label>
                <input
                  type="number"
                  value={newStation.capacity}
                  onChange={(e) => setNewStation({ ...newStation, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddStation}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setIsAddingStation(false);
                    setNewStation({ name: '', address: '', capacity: 0, latitude: 0, longitude: 0 });
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
    </div>
  );
}