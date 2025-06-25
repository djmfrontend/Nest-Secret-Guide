import MessageItem from "../MessageItem/index";
import { VariableSizeList } from "react-window";
import type { ListChildComponentProps } from "react-window";
import type { HistoryMessage, MessageDirection } from "@/types";
import { MessageType, MessageStatus } from "@/types/chat";
import classnames from "classnames";
import styles from "./index.module.less";
import { useMemo } from "react";

interface IProps {
  messages: HistoryMessage[];
  userId: number;
  className?: string;
  listHeight?: number;
  listWidth?: number | string;
  itemSize?: number;
}

const Row = ({
  index,
  style,
  data,
}: ListChildComponentProps<{
  messages: HistoryMessage[];
  currentUserId: number;
}>) => {
  const { messages, currentUserId } = data;
  const message = messages[index];
  const direction: MessageDirection =
    message.senderId === currentUserId ? "outgoing" : "incoming";

  return (
    <div style={style}>
      <MessageItem message={message} direction={direction} />
    </div>
  );
};
export function Content(props: IProps) {
  const {
    messages,
    userId,
    className,
    listHeight = 600,
    listWidth = "100%",
    itemSize = 100,
  } = props;
  // 动态计算每项高度（根据消息内容类型）
  const getItemSize = (index: number) => {
    const message = messages[index];
    // 示例逻辑：文本消息基础高度 + 行数 * 行高
    if (message.type === MessageType.TEXT) {
      const lineCount = Math.ceil(message.content.length / 30); // 假设每行30字符
      return 60 + lineCount * 20; // 基础高度60px + 每行20px
    }
    // 图片/视频等固定高度
    return 200;
  };
  // 传递给 Row 的数据
  const itemData = useMemo(
    () => ({ messages, currentUserId: userId }),
    [messages, userId]
  );
  return (
    // <div className={classnames(styles.content, className)}>
    //   {messages.map((message) => {
    //     const direction = getMessageDirection(message.senderId);
    //     return (
    //       <div
    //         key={message.id}
    //         className={`${styles.messageContainer} ${styles[direction]}`}
    //       >
    //         <div className={styles.messageBubble}>
    //           {renderMessageContent(message)}
    //           <div className={styles.messageMeta}>
    //             <span className={styles.time}>
    //               {new Date(message.createdTime).toLocaleTimeString()}
    //             </span>
    //             {renderMessageStatus(message.status, direction)}
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>

    <div className={styles.content}>
      <VariableSizeList
        height={listHeight}
        width={listWidth}
        itemCount={messages.length}
        itemSize={getItemSize}
        itemData={itemData}
      >
        {Row}
      </VariableSizeList>
    </div>
  );
}
