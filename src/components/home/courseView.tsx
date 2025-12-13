import { useEffect, useRef } from 'react';
import { aiApi } from '../../api';
import { LatLng } from '../../types';

type SingleCourse = {
  name: string;
  start: LatLng;
  end: LatLng;
};

type CourseViewProps = {
  courses: SingleCourse[];
  selectedIndex: number | null;
};

const ROUTE_COLORS = [
  '#6366F1', // Indigo 500
  '#EC4899', // Pink 500
  '#22C55E', // Green 500
  '#3B82F6', // Blue 500
  '#F59E0B', // Amber 500
];

export default function CourseView({
  courses,
  selectedIndex,
}: CourseViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  /* =========================
   * 1️⃣ Kakao Map 최초 1회 생성
   * ========================= */
  useEffect(() => {
    if (!mapRef.current) return;
    if (!(window as any).kakao) {
      console.error('❌ Kakao SDK not loaded');
      return;
    }

    const { kakao } = window as any;

    kakao.maps.load(() => {
      if (mapInstance.current) return;

      const map = new kakao.maps.Map(mapRef.current!, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 7,
      });

      mapInstance.current = map;

      // height 안정화
      setTimeout(() => map.relayout(), 0);

      console.log('✅ Kakao base map created');
    });
  }, []);

  /* =========================
   * 2️⃣ courses / selectedIndex 변경 시 렌더
   * ========================= */
  useEffect(() => {
    if (!mapInstance.current) return;
    if (courses.length === 0) return;

    const { kakao } = window as any;
    const map = mapInstance.current;

    // 기존 요소 제거
    markersRef.current.forEach((m) => m.setMap(null));
    polylinesRef.current.forEach((p) => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();

    const targetCourses =
      selectedIndex === null
        ? courses
        : [courses[selectedIndex]];

    const drawCourse = async (
      course: SingleCourse,
      colorIndex: number
    ) => {
      try {
        const resp = await aiApi.aiCourseGet(
          `${course.start.lng},${course.start.lat}`,
          `${course.end.lng},${course.end.lat}`
        );

        const coords =
          resp.data.data.routes?.[0]?.geometry?.coordinates;

        if (!coords || coords.length === 0) return;

        const path = coords.map(
          (c: number[]) => new kakao.maps.LatLng(c[1], c[0])
        );

        const color =
          ROUTE_COLORS[colorIndex % ROUTE_COLORS.length];

        // 출발 마커
        const startMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(
            course.start.lat,
            course.start.lng
          ),
          title: `${course.name} 출발`,
          map,
        });

        // 도착 마커
        const endMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(
            course.end.lat,
            course.end.lng
          ),
          title: `${course.name} 도착`,
          map,
        });

        markersRef.current.push(startMarker, endMarker);

        // Polyline
        const polyline = new kakao.maps.Polyline({
          path,
          strokeWeight: 6,
          strokeColor: color,
          strokeOpacity: 0.9,
          strokeStyle: 'solid',
        });


        polyline.setMap(map);
        polylinesRef.current.push(polyline);

        path.forEach((latlng: any) => bounds.extend(latlng));

        console.log(`✅ Route drawn: ${course.name}`);
      } catch (err) {
        console.error(`❌ Route error: ${course.name}`, err);
      }
    };

    Promise.all(
      targetCourses.map((course, idx) =>
        drawCourse(
          course,
          selectedIndex === null ? idx : selectedIndex
        )
      )
    ).then(() => {
      if (!bounds.isEmpty()) {
        map.setBounds(bounds);
      }
    });
  }, [courses, selectedIndex]);

  return (
    <div className="w-full relative rounded-lg border border-indigo-200 shadow-lg overflow-hidden">
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
}
