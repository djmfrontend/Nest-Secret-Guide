import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/user";
import type { IFriend } from "@/types";
import { Input, Button } from "antd";
import {} from "react-window";
import { MessageType } from "@/types";
import { Content } from "./components/Content";

import { generatePrivateRoomId } from "@/utils/room";

interface IProps {
  friend: IFriend;
}
const ChatWindow = function (props: IProps) {
  const { friend } = props;
  console.log(friend);
  const { user, initialize } = useAuthStore();
  const { messages, users, sendMessage, joinRoom, leaveRoom } = useSocket();
  useEffect(() => {
    if (!user?.id || !friend) return;
    // const roomId = generatePrivateRoomId(user.id, friend.id);
    joinRoom(user.id, friend.id);
  }, []);
  const [messageText, setMessageText] = useState<string>("");
  if (!user?.id) {
    return <div>请先登录</div>;
  }
  return (
    <div className="w-full h-full">
      <Content
        messages={messages}
        userId={user?.id}
        className="h-[calc(100% - 200px)]"
      ></Content>
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
        <Button onClick={() => initialize()}>111</Button>
      </div>
    </div>
  );
};
export default ChatWindow;
