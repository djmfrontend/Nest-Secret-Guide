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
  type: MessageTypeEnum; // 或者使用枚举
}
