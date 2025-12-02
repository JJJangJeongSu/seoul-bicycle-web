import { useEffect, useRef, useState } from 'react';
import { aiApi } from '../../api';
import { LatLng } from '../../types';

type SingleCourse = {
  name: string;
  start: LatLng;
  end: LatLng;
};

type CourseViewProps = {
  courses: SingleCourse[];
};

export default function CourseView({ courses }: CourseViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // Kakao Map SDK 로드 및 지도 생성
  useEffect(() => {
    if (!(window as any).kakao) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`;
      script.async = true;
      script.onload = () => {
        (window as any).kakao.maps.load(() => {
          setKakaoLoaded(true);
        });
      };
      document.head.appendChild(script);
    } else {
      (window as any).kakao.maps.load(() => setKakaoLoaded(true));
    }
  }, []);

  // 지도 초기 생성
  useEffect(() => {
    if (!kakaoLoaded || !mapRef.current || kakaoMap) return;
    const { kakao } = window as any;

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 기본 서울 시청 중심
      level: 7,
    });

    setKakaoMap(map);
    console.log('Base map created');
  }, [kakaoLoaded, kakaoMap]);

  // 코스가 바뀌면 마커/Polyline 추가
  useEffect(() => {
    if (!kakaoMap || courses.length === 0) return;
    const { kakao } = window as any;

    courses.forEach(async (course) => {
      try {
        const resp = await aiApi.aiCourseGet(
          `${course.start.lng},${course.start.lat}`,
          `${course.end.lng},${course.end.lat}`
        );

        const coords = resp.data.data.routes?.[0]?.geometry?.coordinates;
        if (!coords || coords.length === 0) {
          console.error(`Route fetch failed for ${course.name}`);
          return;
        }

        console.log(`Route received for ${course.name}, points: ${coords.length}`);

        const path = coords.map((c: number[]) => new kakao.maps.LatLng(c[1], c[0]));

        // 마커 추가
        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(course.start.lat, course.start.lng),
          title: '출발',
          map: kakaoMap,
        });
        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(course.end.lat, course.end.lng),
          title: '도착',
          map: kakaoMap,
        });

        // Polyline 추가
        const polyline = new kakao.maps.Polyline({
          path,
          strokeWeight: 5,
          strokeColor: '#8B5CF6',
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
        });
        polyline.setMap(kakaoMap);

        // 지도 bounds 조정
        const bounds = new kakao.maps.LatLngBounds();
        path.forEach((latlng: any) => bounds.extend(latlng));
        kakaoMap.setBounds(bounds);

        console.log(`Route drawn for ${course.name}`);
      } catch (err) {
        console.error(`Route fetch failed for ${course.name}`, err);
      }
    });
  }, [kakaoMap, courses]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-lg border border-indigo-200 shadow-lg relative bg-gray-100 flex items-center justify-center text-gray-500"
    >
      {!kakaoMap && '지도 로딩 중...'}
    </div>
  );
}
