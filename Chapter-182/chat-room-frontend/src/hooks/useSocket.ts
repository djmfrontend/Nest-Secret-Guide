import type { Message, MessageType, HistoryMessage } from "@/types";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { HistoryMessagePayload } from "@/types";

interface UseSocketReturn {
  messages: HistoryMessage[];
  users: Record<number, boolean>; // 用户ID => 是否在线
  sendMessage: (
    sendUserId: number,
    recipientId: number,
    message: {
      type: MessageType;
      content: string;
    }
  ) => void;
  joinRoom: (userId: number, friendId: number) => void;
  leaveRoom: (roomId: number) => void;
}
let socket: Socket;
export const useSocket = (): UseSocketReturn => {
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [users, setUsers] = useState<Record<number, boolean>>({});
  const messagesRef = useRef<HistoryMessage[]>([]); //保存消息的变量
  const usersRef = useRef<Record<number, boolean>>({});
  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:9008", {
        reconnection: true,
        reconnectionAttempts: Infinity,
        randomizationFactor: 1.5,
        withCredentials: true,
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("socket connected");
      });
      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
      // 接收新消息
      socket.on("message", (message: HistoryMessage) => {
        console.log("newMessage", message);
        messagesRef.current = [...messagesRef.current, message];
        setMessages([...messagesRef.current]);
      });
      // 用户上线和下线
      socket.on(
        "usersOnline",
        (payload: { userId: number; status: boolean }) => {
          console.log("userStatus", payload);
          usersRef.current[payload.userId] = payload.status;
          setUsers({ ...usersRef.current });
        }
      );
      socket.on("initialHistory", (payload: HistoryMessagePayload) => {
        messagesRef.current = payload.history;
        setMessages([...messagesRef.current]);
        //
      });
    }
    return () => {
      //组件卸载时断开连接
    };
    // 发送消息到指定房间
  }, []);
  const sendMessage = (
    sendUserId: number,
    recipientId: number,
    message: {
      type: MessageType;
      content: string;
    }
  ) => {
    if (socket && message.content.trim()) {
      socket.emit("sendMessage", { sendUserId, recipientId, message });
    }
  };
  const joinRoom = (userId: number, friendId: number) => {
    if (socket) {
      socket.emit("joinRoom", {
        userId,
        friendId,
      });
    }
  };
  const leaveRoom = (roomId: number) => {
    if (socket) {
      socket.emit("leaveRoom", roomId);
    }
  };
  return {
    messages,
    users,
    sendMessage,
    joinRoom,
    leaveRoom,
  };
};
