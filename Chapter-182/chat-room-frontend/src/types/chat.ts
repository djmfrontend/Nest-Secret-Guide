export interface Message {
  id?: number;
  content: string;
  senderId: number;
  roomId: number;
  createdAt: string;
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  STICKER = "STICKER",
}
