/**
 * AI Service
 *
 * Handles AI-related operations (Course Recommendation)
 * Currently using mock data as requested
 */

const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export interface CourseRecommendation {
  id: string;
  name: string;
  description: string;
  difficulty: '최하' | '하' | '중' | '상' | '최상';
  distance: number;
  duration: number;
  imageUrl?: string;
}

export const recommendCourse = async (preferences: string | {
  difficulty?: string;
  duration?: number;
  distance?: number;
}): Promise<CourseRecommendation[]> => {
  await delay();

  // Mock recommendations based on preferences
  return [
    {
      id: 'course-1',
      name: '한강 힐링 코스',
      description: '시원한 강바람을 맞으며 달리는 초보자 추천 코스',
      difficulty: '하',
      distance: 5.2,
      duration: 30,
      imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'course-2',
      name: '남산 도전 코스',
      description: '업힐을 즐기는 라이더를 위한 중급 코스',
      difficulty: '상',
      distance: 8.5,
      duration: 60,
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'course-3',
      name: '도심 야경 코스',
      description: '서울의 밤을 즐기는 로맨틱 라이딩',
      difficulty: '중',
      distance: 12.0,
      duration: 90,
      imageUrl: 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=1000&auto=format&fit=crop'
    }
  ];
};
