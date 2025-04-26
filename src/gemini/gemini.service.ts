import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GoogleGenAI } from '@google/genai';
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async basicPrompt(dto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, dto);
  }

  async basicPromptStream(dto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, dto);
  }
}
