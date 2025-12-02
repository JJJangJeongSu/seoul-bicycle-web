/**
 * AI Service
 *
 * Handles AI-related API calls (LLM-based course recommendation)
 */

import { aiApi } from '../api';
import type { CourseInfo } from '../types';

/**
 * 사용자의 자연어 요청(prompt)을 분석하여 적합한 자전거 코스를 추천합니다.
 * @param prompt 사용자 입력 문자열
 * @returns CourseInfo 배열
 */
export const recommendCourse = async (prompt: string): Promise<CourseInfo[]> => {
  try {
    // OpenAPI Generator 기반 aiApi 호출
    const response = await aiApi.recommendCourse(prompt);
    
    // Admin Service 패턴과 동일하게 wrapper 처리
    const data = response.data?.data || response.data;

    if (!data?.places || !Array.isArray(data.places)) {
      console.warn('추천 코스 데이터가 비어있습니다.');
      return [];
    }

    // 필요한 필드만 매핑
    return data.places.map((place: any) => ({
      name: place.name,
      startLat: Number(place.start_lat),
      startLon: Number(place.start_lon),
      endLat: Number(place.end_lat),
      endLon: Number(place.end_lon),
      description: place.description || 'AI 추천 코스',
      distance: Number(place.distance) || 0,
      duration: Number(place.duration) || 0,
      difficulty: place.difficulty || '중',
      highlights: place.highlights || [],
    }));
  } catch (error) {
    console.error('AI 코스 추천 실패:', error);
    return [];
  }
};
