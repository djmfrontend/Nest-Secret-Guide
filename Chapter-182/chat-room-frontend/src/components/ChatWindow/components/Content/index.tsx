import MessageItem from "../MessageItem/index";
import { VariableSizeList } from "react-window";
import type { ListChildComponentProps, ListOnScrollProps } from "react-window";
import type { HistoryMessage, MessageDirection } from "@/types";
import { MessageType } from "@/types/chat";
import classnames from "classnames";
import styles from "./index.module.less";
import { useMemo, useRef, useEffect, useState } from "react";

interface IProps {
  messages: HistoryMessage[];
  userId: number;
  friendId: number;
  className?: string;
  listHeight?: number;
  listWidth?: number | string;
  itemSize?: number;
  loading?: boolean; // 是否正在加载
  hasMore?: boolean; //是否还有更多数据加载
  onLoadMore?: () => void; // 加载更多的回调
}

const Row = ({
  index,
  style,
  data,
}: ListChildComponentProps<{
  messages: HistoryMessage[];
  currentUserId: number;
  friendId: number;
}>) => {
  const { messages, currentUserId, friendId } = data;
  const message = messages[index];
  const direction: MessageDirection =
    message.senderId === currentUserId ? "outgoing" : "incoming";

  return (
    <div style={style}>
      <MessageItem
        message={message}
        direction={direction}
        friendId={friendId}
        userId={currentUserId}
      />
    </div>
  );
};
export function Content(props: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState(600);
  const {
    messages,
    userId,
    className,
    friendId,
    listWidth = "100%",
    loading = false,
    onLoadMore,
    hasMore = true,
  } = props;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDynamicHeight(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
    () => ({ messages, currentUserId: userId, friendId }),
    [messages, userId, friendId]
  );
  const listRef = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToItem(messages.length - 1, "end");
    }
  }, [messages]);
  const handleScroll = (data: ListOnScrollProps) => {
    const { scrollDirection, scrollOffset } = data;
    if (
      scrollDirection === "backward" &&
      scrollOffset < 100 &&
      hasMore &&
      !loading &&
      onLoadMore
    ) {
      onLoadMore();
      //
    }
  };
  return (
    <div className={classnames(className, styles.content)} ref={containerRef}>
      <VariableSizeList
        height={dynamicHeight}
        width={listWidth}
        onScroll={handleScroll}
        itemCount={messages.length}
        itemSize={getItemSize}
        itemData={itemData}
      >
        {Row}
      </VariableSizeList>
    </div>
  );
}
