import { useState } from 'react';
import { Sparkles, Loader2, MapPin } from 'lucide-react';
import { aiApi } from '../../api';
import CourseView from '../home/CourseView';
import { LatLng } from '../../types';

type CourseInfo = {
  name: string;
  start: LatLng;
  end: LatLng;
};

export function AICourseRecommendPage() {
  const [prompt, setPrompt] = useState('');
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleRecommend = async () => {
    if (!prompt.trim()) return alert('원하는 코스를 입력해주세요');
    setLoading(true);
    setSelectedIndex(null);

    try {
      const llmResp = await aiApi.recommendCourse(prompt.trim());
      const places = llmResp.data.data.places;

      if (!places || places.length === 0) {
        alert('추천 코스가 없습니다.');
        setCourses([]);
        return;
      }

      const mapped = places.map((p: any) => ({
        name: p.name,
        start: { lat: p.start_lat, lng: p.start_lon },
        end: { lat: p.end_lat, lng: p.end_lon },
      }));

      setCourses(mapped);
    } catch (err) {
      console.error(err);
      alert('코스 추천 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 입력 영역 */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 mb-6">
        <label className="block text-sm text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          어떤 코스를 찾으시나요?
        </label>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 한강 따라 달리는 쉬운 코스"
          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4 min-h-32 resize-none"
          disabled={loading}
        />

        <button
          onClick={handleRecommend}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI가 최적의 코스를 찾고 있습니다...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              AI 코스 추천받기
            </>
          )}
        </button>
      </div>

      {/* 지도 */}
      <div className="w-full mb-6">
        <CourseView
          courses={courses}
          selectedIndex={selectedIndex}
        />
      </div>

      {/* 코스 설명 카드 */}
      {courses.length > 0 && (
        <div className="grid gap-4">
          {courses.map((course, idx) => {
            const selected = selectedIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer rounded-lg border p-4 transition
                  ${
                    selected
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">
                    코스 {idx + 1}. {course.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600">
                  출발지 → 도착지를 잇는 추천 경로입니다.
                </p>

                {selected && (
                  <p className="mt-2 text-sm text-purple-600 font-medium">
                    ✔ 현재 지도에 표시 중
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
