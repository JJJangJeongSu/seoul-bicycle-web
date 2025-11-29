/**
 * AI Service
 *
 * Handles AI-related API calls
 */

import { aiApi } from '../api';

class RealAiService {
  async recommendCourse(prompt: string) {
    const response = await aiApi.recommendCourse({
      prompt,
    });
    return (response.data as any).data || response.data;
  }
}

const realService = new RealAiService();

export class AiService {
  recommendCourse(prompt: string) {
    return realService.recommendCourse(prompt);
  }
}

export const aiService = new AiService();
