import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

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

    response.setHeader('Content-Type', 'text/plain');
    response.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.text;
      response.write(piece);
    }

    response.end();
  }
}
