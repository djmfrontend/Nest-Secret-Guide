import { ChatHistory } from '@prisma/client';

export enum MessageTypeEnum {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio',
  STICKER = 'sticker',
}

export class CreateMessageDto {
  senderId: number;
  recipientId: number;
  content: string;
  type: ChatHistory['type']; // 或者使用枚举
}
