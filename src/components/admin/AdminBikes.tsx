import { useState } from 'react';
import { Plus, Edit, Trash2, Move, X } from 'lucide-react';
import { mockStations } from '../../lib/mockData';

type Bike = {
  id: string;
  station: string;
  status: 'available' | 'rented' | 'maintenance';
  rentals: number;
  lastRental: Date;
};

export function AdminBikes() {
  const initialBikes: Bike[] = [
    { id: 'SPB-12345', station: '가산디지털단지역', status: 'available', rentals: 145, lastRental: new Date('2024-11-07') },
    { id: 'SPB-12346', station: '-', status: 'rented', rentals: 89, lastRental: new Date('2024-11-07') },
    { id: 'SPB-12347', station: '강남역', status: 'maintenance', rentals: 201, lastRental: new Date('2024-11-05') },
    { id: 'SPB-12348', station: '여의도한강공원', status: 'available', rentals: 67, lastRental: new Date('2024-11-06') },
  ];

  const [bikes, setBikes] = useState<Bike[]>(initialBikes);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [movingBike, setMovingBike] = useState<Bike | null>(null);

  const handleEdit = (bike: Bike) => {
    setEditingBike(bike);
  };

  const handleSaveEdit = (newStatus: 'available' | 'rented' | 'maintenance') => {
    if (!editingBike) return;

    setBikes(bikes.map(b => 
      b.id === editingBike.id 
        ? { ...b, status: newStatus }
        : b
    ));
    setEditingBike(null);
    alert('자전거 상태가 변경되었습니다');
  };

  const handleMove = (bike: Bike) => {
    setMovingBike(bike);
  };

  const handleSaveMove = (stationName: string) => {
    if (!movingBike) return;

    setBikes(bikes.map(b => 
      b.id === movingBike.id 
        ? { ...b, station: stationName }
        : b
    ));
    setMovingBike(null);
    alert('자전거가 이동되었습니다');
  };

  const handleDelete = (bike: Bike) => {
    const confirmed = window.confirm(`정말로 자전거 ${bike.id}를 삭제하시겠습니까?`);
    if (!confirmed) return;

    setBikes(bikes.filter(b => b.id !== bike.id));
    alert('자전거가 삭제되었습니다');
  };

  const handleAddBike = () => {
    const newId = `SPB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBike: Bike = {
      id: newId,
      station: '-',
      status: 'available',
      rentals: 0,
      lastRental: new Date(),
    };
    setBikes([...bikes, newBike]);
    alert(`새 자전거 ${newId}가 추가되었습니다`);
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleAddBike}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          자전거 추가
        </button>
      </div>

      {/* Bike List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">자전거 번호</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">현재 위치</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">총 대여</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">최종 대여</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bikes.map(bike => (
                <tr key={bike.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{bike.id}</td>
                  <td className="px-6 py-4 text-sm">{bike.station}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      bike.status === 'available' ? 'bg-green-100 text-green-700' :
                      bike.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {bike.status === 'available' ? '정상' :
                       bike.status === 'rented' ? '대여중' : '고장'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{bike.rentals}회</td>
                  <td className="px-6 py-4 text-sm">{bike.lastRental.toLocaleDateString('ko-KR')}</td>
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
                        onClick={() => handleMove(bike)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded" 
                        title="이동"
                      >
                        <Move className="w-4 h-4" />
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBike && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">자전거 상태 변경</h3>
              <button 
                onClick={() => setEditingBike(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              자전거 번호: {editingBike.id}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleSaveEdit('available')}
                className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  editingBike.status === 'available'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>✅ 정상</span>
                  {editingBike.status === 'available' && <span className="text-xs">(현재)</span>}
                </div>
              </button>

              <button
                onClick={() => handleSaveEdit('rented')}
                className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  editingBike.status === 'rented'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>🚴 대여중</span>
                  {editingBike.status === 'rented' && <span className="text-xs">(현재)</span>}
                </div>
              </button>

              <button
                onClick={() => handleSaveEdit('maintenance')}
                className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  editingBike.status === 'maintenance'
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>🔧 고장</span>
                  {editingBike.status === 'maintenance' && <span className="text-xs">(현재)</span>}
                </div>
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingBike(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Modal */}
      {movingBike && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">자전거 이동</h3>
              <button 
                onClick={() => setMovingBike(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              자전거 번호: {movingBike.id}<br />
              현재 위치: {movingBike.station}
            </p>

            <div className="space-y-2">
              {mockStations.map(station => {
                const stationName = station.name.split('. ')[1] || station.name;
                return (
                  <button
                    key={station.id}
                    onClick={() => handleSaveMove(stationName)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      movingBike.station === stationName
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div>{stationName}</div>
                        <div className="text-xs text-gray-500">{station.address}</div>
                      </div>
                      {movingBike.station === stationName && (
                        <span className="text-xs">(현재)</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setMovingBike(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}