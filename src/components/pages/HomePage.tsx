import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Map as MapIcon, List, RefreshCw, Loader2 } from 'lucide-react';
import type { Station, Rental } from '../../types';
import { seoulDistricts } from '../../lib/mockData';
import { MapView } from '../home/MapView';
import { ListView } from '../home/ListView';
import { StationDetailModal } from '../home/StationDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import { useRental } from '../../contexts/RentalContext';
import { useServices } from '../../hooks/useServices';

export function HomePage() {
  const { user, setShowLoginModal } = useAuth();
  const { currentRental, setCurrentRental } = useRental();
  const { stationService, rentalService } = useServices();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');
  const [bikeFilter, setBikeFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stations on mount
  useEffect(() => {
    // loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stationService.getAllStations();
      setStations(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('정류소 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to load stations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter stations
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // Search filter
      if (searchTerm && !station.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !station.address.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // District filter
      if (selectedDistrict !== '전체' && !station.address.includes(selectedDistrict)) {
        return false;
      }

      // Bike availability filter
      if (bikeFilter === 'available' && station.bikeCount === 0) {
        return false;
      }
      if (bikeFilter === 'unavailable' && station.bikeCount > 0) {
        return false;
      }

      return true;
    });
  }, [stations, searchTerm, selectedDistrict, bikeFilter]);

  const handleRefresh = () => {
    loadStations();
  };

  const handleRent = async (stationId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (user.role === 'admin') {
      alert('관리자는 자전거를 대여할 수 없습니다.\n일반 사용자 계정으로 로그인해주세요.');
      return;
    }

    if (currentRental) {
      alert('이미 대여 중인 자전거가 있습니다');
      return;
    }

    const station = stations.find(s => s.id === stationId);
    if (!station || station.bikeCount === 0) {
      alert('대여 가능한 자전거가 없습니다');
      return;
    }

    try {
      // Create rental via service
      const newRental = await rentalService.createRental(user.id, stationId);

      // Update station bike count
      await stationService.updateStationBikeCount(stationId, station.bikeCount - 1);

      // Refresh stations to reflect updated count
      setStations(prev => prev.map(s =>
        s.id === stationId ? { ...s, bikeCount: s.bikeCount - 1 } : s
      ));

      setCurrentRental(newRental);
      setSelectedStation(null);
      alert(`✅ 대여 완료!\n자전거 번호: ${newRental.bikeId}\n출발 대여소: ${station.name}`);
    } catch (err) {
      console.error('Failed to rent bike:', err);
      alert('자전거 대여에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReturn = async (stationId: string) => {
    if (!currentRental) {
      alert('대여 중인 자전거가 없습니다');
      return;
    }

    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    // Calculate duration (in minutes)
    const duration = Math.floor((new Date().getTime() - currentRental.rentalTime.getTime()) / 60000);

    // Calculate distance (mock - using random value)
    const distance = parseFloat((Math.random() * 10 + 1).toFixed(1));

    try {
      // Return rental via service
      const completedRental = await rentalService.returnRental(
        currentRental.id,
        stationId,
        distance,
        duration
      );

      // Save to localStorage for history
      const existingHistory = localStorage.getItem('rental_history');
      const history: Rental[] = existingHistory ? JSON.parse(existingHistory) : [];

      const rentalToSave = {
        ...completedRental,
        rentalTime: completedRental.rentalTime.toISOString(),
        returnTime: completedRental.returnTime?.toISOString(),
      };
      // history.push(rentalToSave);
      localStorage.setItem('rental_history', JSON.stringify(history));

      // Update station bike count
      await stationService.updateStationBikeCount(stationId, station.bikeCount + 1);

      setStations(prev => prev.map(s =>
        s.id === stationId ? { ...s, bikeCount: s.bikeCount + 1 } : s
      ));

      const startStation = stations.find(s => s.id === currentRental.startStationId);

      alert(`✅ 반납 완료!\n\n출발: ${startStation?.name}\n도착: ${station.name}\n이용 시간: ${duration}분\n이동 거리: ${distance}km`);

      setCurrentRental(null);
      setSelectedStation(null);
    } catch (err) {
      console.error('Failed to return bike:', err);
      alert('자전거 반납에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">정류소 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-destructive mb-4 text-xl">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadStations}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">대여소 현황</h1>
        <p className="text-gray-600">실시간 자전거 대여소 정보를 확인하세요</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
        {/* Search and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="대여소명 또는 주소 검색..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input-background"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              <MapIcon className="w-5 h-5" />
              지도
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              <List className="w-5 h-5" />
              리스트
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">필터:</span>
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input-background"
          >
            <option value="전체">전체 지역</option>
            {seoulDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setBikeFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                bikeFilter === 'all'
                  ? 'bg-muted text-secondary border-2 border-secondary shadow-md scale-105'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setBikeFilter('available')}
              className={`px-4 py-2 rounded-lg transition-all ${
                bikeFilter === 'available'
                  ? 'bg-accent/30 text-accent-foreground border-2 border-accent shadow-md scale-105'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              대여 가능
            </button>
            <button
              onClick={() => setBikeFilter('unavailable')}
              className={`px-4 py-2 rounded-lg transition-all ${
                bikeFilter === 'unavailable'
                  ? 'bg-destructive/30 text-destructive-foreground border-2 border-destructive shadow-md scale-105'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              대여 불가
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg transition-all hover:scale-105 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>

        {/* Last update time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            검색 결과: <span className="text-primary">{filteredStations.length}</span>개 대여소
          </span>
          <span>마지막 업데이트: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <MapView
          stations={filteredStations}
          onStationClick={setSelectedStation}
        />
      ) : (
        <ListView
          stations={filteredStations}
          onStationClick={setSelectedStation}
          onRent={handleRent}
        />
      )}

      {/* Station Detail Modal */}
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onRent={handleRent}
          onReturn={handleReturn}
        />
      )}
    </div>
  );
}