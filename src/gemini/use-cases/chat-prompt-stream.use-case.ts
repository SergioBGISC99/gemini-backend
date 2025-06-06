import { Content, createPartFromUri, GoogleGenAI } from '@google/genai';
import { ChatPromptDto } from '../dtos/chat-promt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-files';

interface Options {
  model?: string;
  systemInstruction?: string;
  history: Content[];
}

export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options,
) => {
  const { files = [], prompt } = chatPromptDto;

  const uploadedFiles = await geminiUploadFiles(ai, files);

  const {
    model = 'gemini-2.0-flash',
    systemInstruction = `
      Responde únicamente en español
      En formato markdown
      Usa negritas de esta forma __
      Usa el sistema métrico decimal
    `,
    history = [],
  } = options ?? {};

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
    history,
  });

  return chat.sendMessageStream({
    message: [
      prompt,
      ...uploadedFiles.map((file) =>
        createPartFromUri(file.uri ?? '', file.mimeType ?? ''),
      ),
    ],
  });
};
