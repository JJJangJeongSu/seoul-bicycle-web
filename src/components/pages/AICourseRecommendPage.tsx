import { useState } from 'react';
import { Navigation, Clock, MapPin, Sparkles, Flame, Mountain, Info, Loader2, MapPinned } from 'lucide-react';
import { aiService } from '../../services/ai.service';

/**
 * TODO: AI 코스 추천 API 연동
 *
 * 현재 상태: 키워드 기반 단순 매칭만 구현
 *
 * 필요한 작업:
 * 1. AI 추천 시스템 구축
 *    - OpenAI GPT API 또는 자체 ML 모델 통합
 *    - 사용자 선호도 분석 알고리즘
 *    - 개인화된 추천 로직
 *
 * 2. 날씨 정보 통합
 *    - OpenWeatherMap API 연동
 *    - 실시간 날씨 기반 코스 조정
 *    - 미세먼지 정보 고려
 *
 * 3. 실시간 데이터 활용
 *    - 현재 교통량 정보
 *    - 정류소별 자전거 현황
 *    - 시간대별 혼잡도
 *
 * 4. 사용자 프로필 관리
 *    - 과거 라이딩 이력 분석
 *    - 체력 수준 측정
 *    - 선호 지역/코스 타입 학습
 *
 * 5. 경로 최적화
 *    - A* 알고리즘 또는 Dijkstra 알고리즘 적용
 *    - 경사도, 신호등, 도로 상태 고려
 *    - 실시간 교통 정보 반영
 *
 * 환경 변수 필요:
 * - VITE_OPENAI_API_KEY (AI 추천)
 * - VITE_WEATHER_API_KEY (날씨 정보)
 * - VITE_AI_SERVICE_URL (자체 AI 서비스 URL)
 */

type CourseInfo = {
  name: string;
  description: string;
  duration: number; // 분
  calories: number; // kcal
  difficulty: '최하' | '하' | '중' | '상' | '최상';
  distance: number; // km
  highlights: string[];
};

export function AICourseRecommendPage() {
  const [prompt, setPrompt] = useState('');
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      '최하': 'bg-green-100 text-green-700 border-green-300',
      '하': 'bg-lime-100 text-lime-700 border-lime-300',
      '중': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      '상': 'bg-orange-100 text-orange-700 border-orange-300',
      '최상': 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[difficulty as keyof typeof colors] || colors['중'];
  };

  const getDifficultyDescription = (difficulty: string) => {
    const descriptions = {
      '최하': '초보자도 쉽게 즐길 수 있는 평탄한 코스',
      '하': '가벼운 운동에 적합한 쉬운 코스',
      '중': '적당한 체력이 필요한 코스',
      '상': '체력이 필요한 도전적인 코스',
      '최상': '고급자를 위한 매우 어려운 코스',
    };
    return descriptions[difficulty as keyof typeof descriptions] || '';
  };

  const fetchCourseRecommendation = async (userPrompt: string) => {
    // Call AI service
    const courseData = await aiService.recommendCourse(userPrompt);
    return courseData;
  };

  const handleRecommend = async () => {
    if (!prompt.trim()) {
      alert('원하는 코스를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const result = await fetchCourseRecommendation(prompt);
      setCourseInfo(result);
    } catch (error) {
      alert('코스 추천 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">✨ AI 코스 추천</h1>
        <p className="text-gray-600">원하는 코스 스타일을 말씀해주시면 AI가 최적의 자전거 코스를 추천해드립니다</p>
      </div>

      {/* Input Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 mb-6">
        <label className="block text-sm text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          어떤 코스를 찾으시나요?
        </label>
        <textarea
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          placeholder="예: 한강을 따라 달리는 쉬운 코스를 추천해주세요&#10;예: 야경이 아름다운 밤 라이딩 코스&#10;예: 칼로리 소모가 많은 운동 코스&#10;예: 초보자도 탈 수 있는 평탄한 코스"
          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 min-h-32 resize-none"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              !loading && handleRecommend();
            }
          }}
          disabled={loading}
        />
        <button
          onClick={handleRecommend}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
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

      {/* Course Result */}
      {courseInfo && (
        <div className="space-y-6">
          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-50 border-2 border-dashed border-indigo-300 rounded-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-indigo-700 mb-2">지도 API 연동 영역</p>
                <p className="text-sm text-indigo-600">추천 코스 경로가 표시됩니다</p>
                
                {/* Mock Map Visual */}
                <div className="mt-6 bg-white rounded-lg p-6 max-w-3xl mx-auto">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center relative overflow-hidden border border-indigo-200">
                    {/* Mock Map Grid */}
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-8">
                      {Array.from({ length: 80 }).map((_, i) => (
                        <div key={i} className="border border-indigo-100" />
                      ))}
                    </div>
                    
                    {/* Mock Route */}
                    <div className="absolute inset-0">
                      {/* Start Point */}
                      <div className="absolute top-1/4 left-1/4 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl z-10 animate-pulse">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Waypoint 1 */}
                      <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      
                      {/* End Point */}
                      <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-xl z-10 animate-pulse">
                        <MapPinned className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Route Line */}
                      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
                        <path
                          d="M 25% 25% Q 40% 35%, 50% 50% T 75% 75%"
                          stroke="#8B5CF6"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="8 4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg z-20 border border-indigo-200">
                      <p className="text-sm text-indigo-700">{courseInfo.name} 경로</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-indigo-500">
                    <code className="bg-indigo-100 px-2 py-1 rounded">
                      {`<!-- 실제 경로는 지도 API 연동 시 표시됩니다 -->`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl">{courseInfo.name}</h2>
                <p className="text-sm text-gray-600">{courseInfo.distance}km 코스</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <h3 className="text-sm">코스 설명</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{courseInfo.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Duration */}
              <div className="bg-white rounded-lg p-4 text-center border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">예상 시간</p>
                <p className="text-2xl text-blue-600">{courseInfo.duration}</p>
                <p className="text-xs text-gray-600">분</p>
              </div>

              {/* Calories */}
              <div className="bg-white rounded-lg p-4 text-center border-2 border-orange-200 hover:border-orange-400 transition-colors">
                <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">칼로리 소모</p>
                <p className="text-2xl text-orange-600">{courseInfo.calories}</p>
                <p className="text-xs text-gray-600">kcal</p>
              </div>

              {/* Distance */}
              <div className="bg-white rounded-lg p-4 text-center border-2 border-green-200 hover:border-green-400 transition-colors">
                <Navigation className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-1">총 거리</p>
                <p className="text-2xl text-green-600">{courseInfo.distance}</p>
                <p className="text-xs text-gray-600">km</p>
              </div>

              {/* Difficulty */}
              <div className={`rounded-lg p-4 text-center border-2 ${getDifficultyColor(courseInfo.difficulty)} hover:opacity-80 transition-opacity`}>
                <Mountain className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs mb-1">난이도</p>
                <p className="text-2xl">{courseInfo.difficulty}</p>
                <p className="text-xs">{getDifficultyDescription(courseInfo.difficulty).split(' ')[0]}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                코스 특징
              </h3>
              <div className="flex flex-wrap gap-2">
                {courseInfo.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm border border-purple-200"
                  >
                    ✨ {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-5 shadow">
            <p className="text-sm text-yellow-800 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              💡 라이딩 전 확인사항
            </p>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 flex-shrink-0">•</span>
                <span>날씨를 확인하고 우천 시에는 라이딩을 자제해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 flex-shrink-0">•</span>
                <span>안전을 위해 헬멧과 보호장구를 착용하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 flex-shrink-0">•</span>
                <span>충분한 수분 섭취를 위해 물을 준비하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 flex-shrink-0">•</span>
                <span>예상 시간과 칼로리는 평균 기준이며 개인차가 있을 수 있습니다</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
