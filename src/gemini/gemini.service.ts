import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async basicPrompt(dto: BasicPromptDto) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: dto.prompt,
      config: {
        systemInstruction:
          'Responde únicamente en español, en formato makrdown',
      },
    });

    return response.text;
  }
}
