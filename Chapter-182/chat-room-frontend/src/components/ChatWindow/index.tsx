import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/user";
import type { IFriend } from "@/types";
import { Input, Button } from "antd";
import { MessageType } from "@/types";

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
  }, []);
  const [messageText, setMessageText] = useState<string>("");
  return (
    <div>
      <div>
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        ></Input>
        <Button
          onClick={() => {
            sendMessage(user!.id, friend!.id, {
              type: MessageType.TEXT,
              content: messageText,
            });
          }}
        >
          发送
        </Button>
      </div>
    </div>
  );
};
export default ChatWindow;
