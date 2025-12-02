import { useEffect, useRef } from 'react';
import type { Station } from '../../types';

type MapViewProps = {
  stations: Station[];
  onStationClick: (station: Station) => void;
};

export function MapView({ stations, onStationClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY;

    if (!mapRef.current) {
      console.error('[MapView] mapRef.current is null');
      return;
    }

    // 기존에 로드된 스크립트 확인
    const existingScript = document.getElementById('kakao-map-sdk') as HTMLScriptElement | null;

    if (!existingScript) {
      console.log('[MapView] Kakao Map SDK script not found, creating one...');
      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        initMap();
      };

      script.onerror = (err) => {
        console.error('[MapView] Failed to load Kakao Map SDK', err);
      };
    } else {
      console.log('[MapView] Kakao Map SDK script already loaded');
      initMap();
    }

    function initMap() {
      const kakao = (window as any).kakao;
      if (!kakao) {
        console.error('[MapView] window.kakao is undefined');
        return;
      }

      kakao.maps.load(() => {
        const container = mapRef.current!;
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
          maxLevel: 5,         // 최대 축소 레벨
        };

        const map = new kakao.maps.Map(container, options);
        console.log('[MapView] Kakao Map instance created:', map);

        // 마커 추가
        stations.forEach(station => {
          if (!station.latitude || !station.longitude) {
            console.warn('[MapView] Station missing lat/lng:', station);
            return;
          }

          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(station.latitude, station.longitude),
          });
          marker.setMap(map);

          kakao.maps.event.addListener(marker, 'click', () => {
            console.log('[MapView] Marker clicked:', station);
            onStationClick(station);
          });
        });

        console.log('[MapView] All markers added:', stations.length);
      });
    }
  }, [stations, onStationClick]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-muted">
      <div ref={mapRef} className="w-full h-[600px]" />
    </div>
  );
}
