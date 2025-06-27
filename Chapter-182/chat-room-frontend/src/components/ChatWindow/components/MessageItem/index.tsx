import type { HistoryMessage, MessageDirection } from "@/types";
import dayjs from "dayjs";

import { MessageType, MessageStatus } from "@/types/chat";
import { forwardRef } from "react";
import styles from "./index.module.less";
interface IProps {
  message: HistoryMessage;
  direction: MessageDirection;
}
const MessageItem = forwardRef<HTMLDivElement, IProps>(function (props, ref) {
  const { message, direction } = props;

  const renderMessageStatus = (status: MessageStatus) => {
    if (direction === "incoming") return null;

    switch (status) {
      case MessageStatus.SENT:
        return <span className={styles.statusIcon}>✓</span>;
      case MessageStatus.DELIVERED:
        return <span className={styles.statusIcon}>✓✓</span>;
      case MessageStatus.READ:
        return <span className={styles.statusIconRead}>✓✓</span>;
      case MessageStatus.SENDING:
        return <span className={styles.statusSending}>发送中</span>;
      default:
        return null;
    }
  };
  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.TEXT:
        return <div className={styles.textContent}>{message.content}</div>;
      case MessageType.IMAGE:
        return (
          <div className={styles.imageContent}>
            <img src={message.content} alt="图片" />
          </div>
        );
      case MessageType.FILE:
        return (
          <div className={styles.fileContent}>
            <div className={styles.fileIcon}>📄</div>
            <div className={styles.fileName}>{message.content}</div>
          </div>
        );
      // 其他消息类型的处理...
      default:
        return <div className={styles.textContent}>{message.content}</div>;
    }
  };

  //   const messageDirection = getMessageDirection(message.senderId);
  return (
    <div
      ref={ref}
      className={`${styles.messageContainer} ${styles[direction]}`}
    >
      <div>头像</div>
      <div className={styles.messageBubble}>
        {renderMessageContent()}
        <div className={styles.messageMeta}>
          <span className={styles.time}>
            {dayjs(message.createdTime).format("YYYY-MM-DD hh:mm:ss")}
          </span>
          {renderMessageStatus(message.status)}
        </div>
      </div>
    </div>
  );
});

export default MessageItem;
