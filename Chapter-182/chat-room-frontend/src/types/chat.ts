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
export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  SENDING = "SENDING",
}

export interface HistoryMessage {
  chatRoomId: string;
  content: string;
  createdTime: string;
  id: number;
  recipientId: number;
  senderId: number;
  status: MessageStatus;
  type: MessageType;
  updatedTime: "2025-06-15T21:24:35.278Z";
}

export interface HistoryMessagePayload {
  count: number;
  history: HistoryMessage[];
}

export type MessageDirection = "incoming" | "outgoing";

export interface ToolItem {
  name: string;
  icon: string;
  component: any;
}
