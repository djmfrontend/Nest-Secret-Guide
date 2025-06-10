import type { Message } from "@/types";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
interface UseSocketReturn {
  messages: Message[];
  users: Record<number, boolean>; // 用户ID => 是否在线
  sendMessage: (roomId: number, content: string) => void;
  joinRoom: (userId: number, friendId: number) => void;
  leaveRoom: (roomId: number) => void;
}
let socket: Socket;
export const useSocket = (): UseSocketReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<number, boolean>>({});
  const messagesRef = useRef<Message[]>([]); //保存消息的变量
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
      socket.on("newMessage", (message: Message) => {
        messagesRef.current = [...messagesRef.current, message];
        setMessages([...messagesRef.current]);
      });
      // 用户上线和下线
      socket.on(
        "userStatus",
        (payload: { userId: number; status: boolean }) => {
          usersRef.current[payload.userId] = payload.status;
          setUsers({ ...usersRef.current });
        }
      );
    }
    return () => {
      //组件卸载时断开连接
    };
    // 发送消息到指定房间
  }, []);
  const sendMessage = (roomId: number, content: string) => {
    if (socket && content.trim()) {
      socket.emit("sendMessage", { roomId, content });
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
