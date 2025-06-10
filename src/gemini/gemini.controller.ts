import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GeminiService } from './gemini.service';
import { ChatPromptDto } from './dtos/chat-promt.dto';
import { GenerateContentResponse } from '@google/genai';
import { ImageGenerationDto } from './dtos/image-generation.dto';
import { PokemonHelperDto } from './dtos/pokemon-helper.dto';
import { TriviaQuestionDto } from './dtos/trivia-question.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(
    response: Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>,
  ) {
    response.setHeader('Content-Type', 'text/plain');
    response.status(HttpStatus.OK);

    let resultText = '';

    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      response.write(piece);
    }

    response.end();
    return resultText;
  }

  @Post('basic-prompt')
  basicPrompt(@Body() dto: BasicPromptDto) {
    return this.geminiService.basicPrompt(dto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() dto: BasicPromptDto,
    @Res() response: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    dto.files = files;

    const stream = await this.geminiService.basicPromptStream(dto);

    this.outputStreamResponse(response, stream);
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() response: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    chatPromptDto.files = files;

    const stream = await this.geminiService.chatStream(chatPromptDto);
    const data = await this.outputStreamResponse(response, stream);

    const geminiMessage = {
      role: 'model',
      parts: [{ text: data }],
    };

    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);
  }

  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      parts: message.parts.map((part) => part.text).join(''),
    }));
  }

  @Post('image-generation')
  @UseInterceptors(FilesInterceptor('files'))
  async imageGeneration(
    @Body() dto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    dto.files = files;

    const { imageUrl, text } = await this.geminiService.imageGeneration(dto);

    return {
      imageUrl,
      text,
    };
  }

  @Post('pokemon-helper')
  getPokemonHelp(@Body() dto: PokemonHelperDto) {
    return this.geminiService.getPokemonHelp(dto);
  }

  @Get('question/:topic')
  getTriviaQuestion(@Param('topic') topic: string) {
    const dto: TriviaQuestionDto = { topic };
    return this.geminiService.getTriviaQuestion(dto);
  }
}
