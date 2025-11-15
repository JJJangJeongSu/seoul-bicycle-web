import { MapPin, Bike } from 'lucide-react';
import { Station } from '../../App';

type MapViewProps = {
  stations: Station[];
  onStationClick: (station: Station) => void;
};

export function MapView({ stations, onStationClick }: MapViewProps) {
  // This is a simplified map view. In production, you would use a real map library like Leaflet or Google Maps
  
  const getMarkerColor = (station: Station) => {
    if (station.status === 'inactive') return 'bg-gray-400';
    if (station.bikeCount === 0) return 'bg-primary';
    if (station.bikeCount <= 4) return 'bg-chart-4';
    return 'bg-accent';
  };

  const getMarkerLabel = (station: Station) => {
    if (station.status === 'inactive') return '운영중지';
    if (station.bikeCount === 0) return '대여불가';
    if (station.bikeCount <= 4) return '여유부족';
    return '대여여유';
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-muted">
      {/* Map Legend */}
      <div className="bg-muted p-5 border-b-4 border-muted flex items-center gap-6 flex-wrap">
        <span className="text-sm">🗺️ 범례:</span>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-sm text-gray-700">✨ 대여 여유 (5대 이상)</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-chart-4"></div>
          <span className="text-sm text-gray-700">⚠️ 여유 부족 (1-4대)</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-gray-700">❌ 대여 불가 (0대)</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-sm text-gray-700">⏸️ 운영 중지</span>
        </div>
      </div>

      {/* Simplified Map View */}
      <div className="relative bg-sky-50 h-[600px] overflow-auto p-8">
        {/* Grid to simulate map */}
        <div className="relative w-full h-full min-w-[800px] min-h-[800px]">
          {stations.map((station, index) => {
            // Position stations in a grid-like pattern (simplified)
            const row = Math.floor(index / 5);
            const col = index % 5;
            const top = row * 150 + 50;
            const left = col * 150 + 50;

            return (
              <div
                key={station.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: `${top}px`, left: `${left}px` }}
                onClick={() => onStationClick(station)}
              >
                {/* Marker */}
                <div className="relative">
                  <MapPin
                    className={`w-10 h-10 ${getMarkerColor(station)} text-white drop-shadow-lg group-hover:scale-110 transition-transform`}
                    fill="currentColor"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-2">
                    <Bike className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[220px] border-4 border-muted">
                    <p className="text-sm mb-1">📍 {station.name}</p>
                    <p className="text-xs text-gray-600 mb-2">{station.address}</p>
                    <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-full">
                      <span className="text-sm text-gray-700">🚲 자전거:</span>
                      <span className={`text-sm ${
                        station.bikeCount === 0 ? 'text-primary' : 'text-accent'
                      }`}>
                        {station.bikeCount}대
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t-2 border-muted/50 flex justify-center">
                      <span className={`text-xs px-3 py-1.5 rounded-full shadow-sm ${
                        station.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                        station.bikeCount === 0 ? 'bg-primary/20 text-primary' :
                        station.bikeCount <= 4 ? 'bg-chart-4/30 text-accent-foreground' :
                        'bg-accent/30 text-accent-foreground'
                      }`}>
                        {getMarkerLabel(station)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Info */}
        <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-2xl p-5 max-w-xs border-4 border-secondary/30">
          <p className="text-sm text-gray-600 mb-2">
            💡 실제 서비스에서는 실시간 지도가 표시됩니다
          </p>
          <p className="text-xs text-gray-500">
            🖱️ 마커를 클릭하면 상세 정보를 확인할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
