import { GoogleGenAI } from '@google/genai';
import { BasicPromptDto } from '../dtos/basic-prompt.dto';

interface Options {
  model?: string;
}

export const basicPromptUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { model = 'gemini-2.0-flash' } = options;

  const response = await ai.models.generateContent({
    model,
    contents: basicPromptDto.prompt,
    config: {
      systemInstruction: 'Responde únicamente en español, en formato makrdown',
    },
  });

  return response.text;
};
