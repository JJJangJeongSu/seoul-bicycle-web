import { useState } from 'react';
import { Navigation, Clock, MapPin, Sparkles, Flame, Mountain, Info, Loader2, MapPinned } from 'lucide-react';

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

  // AI API 호출 모의 함수
  const fetchCourseRecommendation = async (userPrompt: string): Promise<CourseInfo> => {
    // 실제로는 AI API를 호출
    await new Promise(resolve => setTimeout(resolve, 2000));

    const keyword = userPrompt.toLowerCase();

    // 키워드 기반 코스 추천
    if (keyword.includes('한강') || keyword.includes('강변')) {
      return {
        name: '한강 라이딩 코스',
        description: '한강을 따라 달리는 시원한 코스입니다. 넓은 자전거 도로와 아름다운 강변 풍경을 즐기며 여유로운 라이딩을 할 수 있습니다. 여의도 한강공원에서 출발하여 반포 한강공원까지 이어지는 코스로, 중간중간 휴식 공간과 편의시설이 잘 갖춰져 있습니다.',
        duration: 90,
        calories: 450,
        difficulty: '하',
        distance: 15.2,
        highlights: ['강변 풍경', '평탄한 도로', '휴식 공간', '편의시설'],
      };
    } else if (keyword.includes('남산')) {
      return {
        name: '남산 순환 도전 코스',
        description: '남산을 한 바퀴 도는 도전적인 코스입니다. 경사가 급한 오르막이 있어 체력이 많이 소모되지만, 정상에서 보는 서울 야경과 성취감은 그 무엇과도 바꿀 수 없습니다. 초보자보다는 어느 정도 라이딩 경험이 있는 분들께 추천합니다.',
        duration: 75,
        calories: 680,
        difficulty: '최상',
        distance: 9.8,
        highlights: ['서울 전망', '급경사', '야경 명소', '성취감'],
      };
    } else if (keyword.includes('야간') || keyword.includes('밤')) {
      return {
        name: '서울 야경 투어 코스',
        description: '서울의 아름다운 야경을 감상하며 달리는 코스입니다. LED 조명이 켜진 한강대교를 지나 여의도, 반포대교 달빛무지개분수를 거쳐 돌아오는 환상적인 야간 라이딩 코스입니다.',
        duration: 60,
        calories: 320,
        difficulty: '중',
        distance: 12.0,
        highlights: ['야경', '조명', '분수쇼', '낭만적'],
      };
    } else if (keyword.includes('초보') || keyword.includes('쉬운')) {
      return {
        name: '초보자 추천 평탄 코스',
        description: '처음 자전거를 타시는 분들을 위한 완만하고 안전한 코스입니다. 서울숲에서 시작하여 뚝섬 한강공원까지 이어지는 평탄한 코스로, 경사가 거의 없어 편안하게 라이딩을 즐길 수 있습니다.',
        duration: 45,
        calories: 220,
        difficulty: '최하',
        distance: 8.5,
        highlights: ['평탄', '안전', '공원', '초보자'],
      };
    } else if (keyword.includes('운동') || keyword.includes('칼로리') || keyword.includes('다이어트')) {
      return {
        name: '칼로리 소모 집중 코스',
        description: '효과적인 칼로리 소모를 위한 코스입니다. 오르막과 내리막이 적절히 섞여 있어 심박수를 높이고 지방 연소에 효과적입니다. 중랑천 자전거길을 따라 달리며 일정한 속도를 유지하는 것이 중요합니다.',
        duration: 120,
        calories: 850,
        difficulty: '상',
        distance: 22.5,
        highlights: ['고강도', '칼로리', '운동', '지구력'],
      };
    } else if (keyword.includes('공원') || keyword.includes('산책')) {
      return {
        name: '서울숲 여유 코스',
        description: '서울숲 공원을 중심으로 한 여유로운 코스입니다. 나무 그늘 아래에서 시원한 바람을 맞으며 가벼운 라이딩을 즐길 수 있습니다. 중간에 카페에서 휴식을 취하기에도 좋습니다.',
        duration: 50,
        calories: 280,
        difficulty: '최하',
        distance: 10.2,
        highlights: ['공원', '나무', '여유', '카페'],
      };
    } else if (keyword.includes('관광') || keyword.includes('명소')) {
      return {
        name: '서울 랜드마크 투어 코스',
        description: '서울의 주요 랜드마크를 자전거로 둘러보는 관광 코스입니다. 광화문, 경복궁, 청계천, 동대문을 거쳐 돌아오며 서울의 역사와 현대가 공존하는 모습을 감상할 수 있습니다.',
        duration: 100,
        calories: 520,
        difficulty: '중',
        distance: 18.3,
        highlights: ['관광', '역사', '문화', '사진'],
      };
    } else {
      // 기본 추천 코스
      return {
        name: '서울 추천 라이딩 코스',
        description: `"${userPrompt}"에 맞는 추천 코스입니다. 서울의 아름다운 풍경을 감상하며 즐거운 라이딩을 경험할 수 있는 균형 잡힌 코스입니다. 평탄한 구간과 약간의 언덕이 섞여 있어 지루하지 않게 라이딩을 즐길 수 있습니다.`,
        duration: 70,
        calories: 380,
        difficulty: '중',
        distance: 13.5,
        highlights: ['균형잡힌', '다양성', '추천', '경치'],
      };
    }
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
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 한강을 따라 달리는 쉬운 코스를 추천해주세요&#10;예: 야경이 아름다운 밤 라이딩 코스&#10;예: 칼로리 소모가 많은 운동 코스&#10;예: 초보자도 탈 수 있는 평탄한 코스"
          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 min-h-32 resize-none"
          onKeyDown={(e) => {
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
