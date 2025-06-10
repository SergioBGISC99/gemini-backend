import { Content, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { ChatPromptDto } from './dtos/chat-promt.dto';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';
import { ImageGenerationDto } from './dtos/image-generation.dto';
import { imageGenerationUseCase } from './use-cases/image-generation.use-case';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  private chatHistory = new Map<string, Content[]>();

  async basicPrompt(dto: BasicPromptDto) {
    return basicPromptUseCase(this.ai, dto);
  }

  async basicPromptStream(dto: BasicPromptDto) {
    return basicPromptStreamUseCase(this.ai, dto);
  }

  async chatStream(dto: ChatPromptDto) {
    const chatHistory = this.getChatHistory(dto.chatId);
    return chatPromptStreamUseCase(this.ai, dto, { history: chatHistory });
  }

  async imageGeneration(dto: ImageGenerationDto) {
    return imageGenerationUseCase(this.ai, dto);
  }

  saveMessage(chatId: string, message: Content) {
    const messages = this.getChatHistory(chatId);
    messages.push(message);
    this.chatHistory.set(chatId, messages);
  }

  getChatHistory(chatId: string) {
    return structuredClone(this.chatHistory.get(chatId) ?? []);
  }
}
