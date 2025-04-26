import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  basicPrompt() {
    return { hola: 'Saludos desde el service' };
  }
}
