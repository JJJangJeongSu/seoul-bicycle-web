import { useState } from 'react';
import { Plus, Edit, Power, X } from 'lucide-react';
import { mockStations } from '../../lib/mockData';
import { Station } from '../../App';

export function AdminStations() {
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isAddingStation, setIsAddingStation] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '',
    address: '',
    bikeCount: 0,
  });

  const handleEdit = (station: Station) => {
    setEditingStation(station);
  };

  const handleSaveEdit = () => {
    if (!editingStation) return;

    if (!editingStation.name || !editingStation.address) {
      alert('대여소명과 주소를 입력해주세요');
      return;
    }

    setStations(stations.map(s => 
      s.id === editingStation.id 
        ? editingStation
        : s
    ));
    setEditingStation(null);
    alert('대여소 정보가 수정되었습니다');
  };

  const handleToggleStatus = (station: Station) => {
    const newStatus = station.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'inactive' ? '폐쇄' : '재개장';
    
    const confirmed = window.confirm(`정말로 ${station.name} 대여소를 ${action}하시겠습니까?`);
    if (!confirmed) return;

    setStations(stations.map(s => 
      s.id === station.id 
        ? { ...s, status: newStatus }
        : s
    ));
    
    alert(`${station.name} 대여소가 ${action}되었습니다`);
  };

  const handleAddStation = () => {
    if (!newStation.name || !newStation.address) {
      alert('대여소명과 주소를 입력해주세요');
      return;
    }

    const newId = `ST-${Math.floor(100 + Math.random() * 900)}`;
    const station: Station = {
      id: newId,
      name: newStation.name,
      address: newStation.address,
      latitude: 37.5665 + (Math.random() - 0.5) * 0.1,
      longitude: 126.9780 + (Math.random() - 0.5) * 0.1,
      bikeCount: newStation.bikeCount,
      status: 'active',
    };

    setStations([...stations, station]);
    setIsAddingStation(false);
    setNewStation({ name: '', address: '', bikeCount: 0 });
    alert(`새 대여소 ${station.name}가 추가되었습니다`);
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <label className="block text-sm text-gray-600 mb-1">자전거 수</label>
                <input
                  type="number"
                  value={editingStation.bikeCount}
                  onChange={(e) => setEditingStation({ ...editingStation, bikeCount: parseInt(e.target.value) || 0 })}
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
                  setNewStation({ name: '', address: '', bikeCount: 0 });
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
                <label className="block text-sm text-gray-600 mb-1">자전거 수</label>
                <input
                  type="number"
                  value={newStation.bikeCount}
                  onChange={(e) => setNewStation({ ...newStation, bikeCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  💡 위도/경도는 자동으로 설정됩니다
                </p>
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
                    setNewStation({ name: '', address: '', bikeCount: 0 });
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