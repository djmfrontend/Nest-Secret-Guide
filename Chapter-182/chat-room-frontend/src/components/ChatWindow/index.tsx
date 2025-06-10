import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/user";
import type { IFriend } from "@/types";
import { generatePrivateRoomId } from "@/utils/room";
interface Message {
  type: "text" | "image";
}
interface IProps {
  friend: IFriend;
}
const ChatWindow = function (props: IProps) {
  const { friend } = props;
  console.log(friend);
  const { user } = useAuthStore();
  const { messages, users, sendMessage, joinRoom, leaveRoom } = useSocket();
  useEffect(() => {
    if (!user?.id || !friend) return;
    // const roomId = generatePrivateRoomId(user.id, friend.id);
    joinRoom(user.id, friend.id);
  });
  return <div>ChatWindow</div>;
};
export default ChatWindow;
