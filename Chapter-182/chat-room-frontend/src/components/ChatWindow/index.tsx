import { useEffect, useRef } from "react";

import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/user";
import type { IFriend } from "@/types";

import {} from "react-window";
import { MessageType } from "@/types";
import { Content } from "./components/Content";
import ChatInput from "./components/ChatInput";
import DraggableContainer from "@/components/DraggableContainer";

interface IProps {
  friend: IFriend;
}
const ChatWindow = function (props: IProps) {
  const { friend } = props;
  console.log(friend);
  const { user } = useAuthStore();
  const chatInputRef = useRef<HTMLElement>(null);
  const { messages, sendMessage, joinRoom, leaveRoom } = useSocket();
  useEffect(() => {
    if (!user?.id || !friend) return;
    // const roomId = generatePrivateRoomId(user.id, friend.id);
    joinRoom(user.id, friend.id);
    return () => {
      leaveRoom(user.id, friend.id);
    };
  }, [friend.id, user?.id]);

  if (!user?.id) {
    return <div>请先登录</div>;
  }

  const handleSend = (content: string) => {
    sendMessage(user.id, friend.id, {
      type: MessageType.TEXT,
      content: content,
    });
  };
  return (
    <div className="h-full flex flex-col w-full">
      <DraggableContainer layout="column">
        <Content
          messages={messages}
          userId={user?.id}
          friendId={friend.id}
          className="flex-1"
        ></Content>
        <div ref={chatInputRef}>
          <ChatInput onSend={handleSend}></ChatInput>
        </div>
      </DraggableContainer>
    </div>
  );
};
export default ChatWindow;
