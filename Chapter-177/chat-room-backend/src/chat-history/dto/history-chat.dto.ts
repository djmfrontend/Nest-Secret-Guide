import { ChatHistory } from '@prisma/client';

export type HistoryDto = Pick<
  ChatHistory,
  'chatRoomId' | 'senderId' | 'type' | 'content'
>;
