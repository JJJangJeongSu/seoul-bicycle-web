import { useState } from 'react';
import { Navigation, Clock, MapPin, Route as RouteIcon, Bike, ArrowRight, MapPinned, Search } from 'lucide-react';
import { mockStations } from '../../lib/mockData';

type Station = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  bikeCount: number;
  status: string;
};

type RouteResult = {
  startStation: Station;
  endStation: Station;
  distance: number;
  duration: number;
  walkingToStart: number;
  walkingFromEnd: number;
};

export function RoutePage() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [showStationSelect, setShowStationSelect] = useState<'start' | 'end' | null>(null);
  
  // 두 지점 간 거리 계산 (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 주소를 임의의 좌표로 변환 (실제로는 Geocoding API 사용)
  const addressToCoordinates = (address: string): { lat: number; lon: number } => {
    // Mock implementation - 실제로는 Kakao Map Geocoding API 등을 사용
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      lat: 37.4 + (hash % 100) / 500, // 서울 근처 좌표
      lon: 126.8 + (hash % 100) / 500
    };
  };

  // 가장 가까운 대여소 찾기
  const findNearestStation = (lat: number, lon: number): Station => {
    const activeStations = mockStations.filter(s => s.status === 'active' && s.bikeCount > 0);
    
    let nearest = activeStations[0];
    let minDistance = calculateDistance(lat, lon, nearest.latitude, nearest.longitude);

    activeStations.forEach(station => {
      const distance = calculateDistance(lat, lon, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return nearest;
  };

  // 가장 가까운 반납 대여소 찾기 (자전거 수 상관없음)
  const findNearestReturnStation = (lat: number, lon: number): Station => {
    const activeStations = mockStations.filter(s => s.status === 'active');
    
    let nearest = activeStations[0];
    let minDistance = calculateDistance(lat, lon, nearest.latitude, nearest.longitude);

    activeStations.forEach(station => {
      const distance = calculateDistance(lat, lon, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    return nearest;
  };

  // 경로 찾기
  const handleFindRoute = () => {
    if (!currentLocation.trim() || !destination.trim()) {
      alert('출발지와 목적지를 모두 입력해주세요');
      return;
    }

    // 좌표 변환
    const startCoords = addressToCoordinates(currentLocation);
    const endCoords = addressToCoordinates(destination);

    // 가장 가까운 대여소 찾기
    const startStation = findNearestStation(startCoords.lat, startCoords.lon);
    const endStation = findNearestReturnStation(endCoords.lat, endCoords.lon);

    // 거리 계산
    const walkingToStart = calculateDistance(startCoords.lat, startCoords.lon, startStation.latitude, startStation.longitude);
    const bikeDistance = calculateDistance(startStation.latitude, startStation.longitude, endStation.latitude, endStation.longitude);
    const walkingFromEnd = calculateDistance(endStation.latitude, endStation.longitude, endCoords.lat, endCoords.lon);

    // 시간 계산 (자전거: 15km/h, 도보: 4km/h)
    const bikeDuration = (bikeDistance / 15) * 60; // 분
    const walkingStartDuration = (walkingToStart / 4) * 60; // 분
    const walkingEndDuration = (walkingFromEnd / 4) * 60; // 분
    const totalDuration = Math.round(bikeDuration + walkingStartDuration + walkingEndDuration);

    setRouteResult({
      startStation,
      endStation,
      distance: bikeDistance,
      duration: totalDuration,
      walkingToStart,
      walkingFromEnd,
    });
  };

  // 대여소 직접 선택
  const handleStationSelect = (station: Station, type: 'start' | 'end') => {
    if (type === 'start') {
      setCurrentLocation(station.name);
    } else {
      setDestination(station.name);
    }
    setShowStationSelect(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">🗺️ 자전거 길찾기</h1>
        <p className="text-gray-600">출발지와 목적지를 입력하면 가장 가까운 대여소와 최적 경로를 안내해드립니다</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="space-y-4">
          {/* 출발지 */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              출발지
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="예: 강남역, 여의도, 홍대입구역"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowStationSelect('start')}
                className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                대여소 선택
              </button>
            </div>
          </div>

          {/* 목적지 */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
              <MapPinned className="w-4 h-4 text-green-600" />
              목적지
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="예: 서울역, 명동, 이태원"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowStationSelect('end')}
                className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                대여소 선택
              </button>
            </div>
          </div>

          {/* 경로 찾기 버튼 */}
          <button
            onClick={handleFindRoute}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RouteIcon className="w-5 h-5" />
            경로 찾기
          </button>
        </div>
      </div>

      {/* Station Selection Modal */}
      {showStationSelect && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">
              {showStationSelect === 'start' ? '출발 대여소 선택' : '도착 대여소 선택'}
            </h3>
            <button
              onClick={() => setShowStationSelect(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {mockStations
              .filter(s => s.status === 'active')
              .filter(s => showStationSelect === 'start' ? s.bikeCount > 0 : true)
              .map(station => (
                <button
                  key={station.id}
                  onClick={() => handleStationSelect(station, showStationSelect)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 truncate">{station.name}</p>
                      <p className="text-sm text-gray-600 truncate">{station.address}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 rounded text-sm ${
                        station.bikeCount > 5
                          ? 'bg-green-100 text-green-700'
                          : station.bikeCount > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {station.bikeCount}대
                      </span>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Route Result */}
      {routeResult && (
        <div className="space-y-6">
          {/* Map Placeholder for API Integration */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 mb-2">지도 API 연동 영역</p>
                <p className="text-sm text-slate-500">Kakao Map 또는 Google Maps API 연결 예정</p>
                
                {/* Mock Map Visual */}
                <div className="mt-6 bg-white rounded-lg p-6 max-w-2xl mx-auto">
                  <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Mock Map Grid */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-slate-200" />
                      ))}
                    </div>
                    
                    {/* Mock Route Line */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full max-w-md">
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
                          <MapPinned className="w-6 h-6 text-white" />
                        </div>
                        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                          <path
                            d="M 25% 25% Q 50% 40%, 75% 75%"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="8 4"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-20">
                      <p className="text-sm text-slate-600">경로 미리보기</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-slate-500">
                    <code className="bg-slate-100 px-2 py-1 rounded">
                      {`<!-- Kakao Map / Google Maps API 삽입 위치 -->`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Overview */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg shadow p-6">
            <div className="flex items-center justify-center mb-6">
              <RouteIcon className="w-12 h-12 text-blue-600" />
            </div>
            
            <h3 className="text-center text-xl mb-4">추천 경로</h3>

            {/* Route Path */}
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-8 h-8" />
                </div>
                <p className="text-sm">출발지</p>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bike className="w-8 h-8" />
                </div>
                <p className="text-sm">대여소</p>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <Navigation className="w-8 h-8" />
                </div>
                <p className="text-sm">자전거 이동</p>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bike className="w-8 h-8" />
                </div>
                <p className="text-sm">반납소</p>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPinned className="w-8 h-8" />
                </div>
                <p className="text-sm">목적지</p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">예상 소요 시간</p>
                <p className="text-2xl text-blue-600">{routeResult.duration}</p>
                <p className="text-sm text-gray-600">분</p>
              </div>
              <div className="text-center">
                <Navigation className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">자전거 이동 거리</p>
                <p className="text-2xl text-green-600">{routeResult.distance.toFixed(1)}</p>
                <p className="text-sm text-gray-600">km</p>
              </div>
            </div>
          </div>

          {/* Detailed Route Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg mb-4">상세 경로 안내</h3>
            
            <div className="space-y-4">
              {/* Step 1: 출발지 → 대여소 */}
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">출발지에서 대여소까지 도보 이동</p>
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-sm">
                        <span className="text-blue-600">🚶</span> {currentLocation}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 my-1" />
                      <p className="text-sm truncate">
                        <span className="text-blue-600">🚲</span> {routeResult.startStation.name}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📍 거리: {(routeResult.walkingToStart * 1000).toFixed(0)}m</span>
                      <span>⏱️ 약 {Math.round((routeResult.walkingToStart / 4) * 60)}분</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: 자전거 대여 */}
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">자전거 대여</p>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm mb-1 truncate">{routeResult.startStation.name}</p>
                      <p className="text-xs text-gray-600 truncate">{routeResult.startStation.address}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          routeResult.startStation.bikeCount > 5
                            ? 'bg-green-100 text-green-700'
                            : routeResult.startStation.bikeCount > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          이용 가능: {routeResult.startStation.bikeCount}대
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: 자전거 이동 */}
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">자전거로 이동</p>
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-sm truncate">
                        <span className="text-blue-600">🚲</span> {routeResult.startStation.name}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 my-1" />
                      <p className="text-sm truncate">
                        <span className="text-blue-600">🚲</span> {routeResult.endStation.name}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📍 거리: {routeResult.distance.toFixed(1)}km</span>
                      <span>⏱️ 약 {Math.round((routeResult.distance / 15) * 60)}분</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: 자전거 반납 */}
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">자전거 반납</p>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm mb-1 truncate">{routeResult.endStation.name}</p>
                      <p className="text-xs text-gray-600 truncate">{routeResult.endStation.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: 반납소 → 목적지 */}
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">반납소에서 목적지까지 도보 이동</p>
                    <div className="bg-green-50 rounded-lg p-3 mb-2">
                      <p className="text-sm truncate">
                        <span className="text-green-600">🚲</span> {routeResult.endStation.name}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 my-1" />
                      <p className="text-sm">
                        <span className="text-green-600">🏁</span> {destination}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📍 거리: {(routeResult.walkingFromEnd * 1000).toFixed(0)}m</span>
                      <span>⏱️ 약 {Math.round((routeResult.walkingFromEnd / 4) * 60)}분</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">💡 이용 팁</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 출발 전 대여소의 자전거 현황을 다시 한번 확인하세요</li>
              <li>• 평균 자전거 속도 15km/h 기준으로 계산되었습니다</li>
              <li>• 실제 소요 시간은 교통 상황과 체력에 따라 달라질 수 있습니다</li>
              <li>• 안전을 위해 헬멧 착용을 권장합니다</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
