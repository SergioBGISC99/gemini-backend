import { Content, createPartFromUri, GoogleGenAI } from '@google/genai';

import { geminiUploadFiles } from '../helpers/gemini-upload-files';
import { ImageGenerationDto } from '../dtos/image-generation.dto';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const imageGenerationUseCase = async (
  ai: GoogleGenAI,
  imageGenerationDto: ImageGenerationDto,
  options?: Options,
): Promise<ImageGenerationResponse> => {
  const { files = [], prompt } = imageGenerationDto;

  const uploadedFiles = await geminiUploadFiles(ai, files);

  const {
    model = 'gemini-2.0-flash',
    systemInstruction = `
      Responde únicamente en español
      En formato markdown
      Usa negritas de esta forma __
      Usa el sistema métrico decimal
    `,
  } = options ?? {};

  return {
    imageUrl: 'xxxx',
    text: 'abc',
  };
};
