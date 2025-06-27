import styles from "./index.module.less";
import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import type { ToolItem } from "@/types";
import Iconfont from "@/components/Iconfont";

interface IProps {
  className?: string;
  onSend?: (content: string) => void;
  placeholder?: string;
}

const tools: ToolItem[] = [
  {
    name: "emoji",
    icon: "ic:baseline-emoji-emotions",
  },
  {
    name: "image",
    icon: "ic:baseline-image",
  },
  {
    name: "file",
    icon: "ic:baseline-attach-file",
  },
];
function ChatInput(props: IProps) {
  const { className, onSend, placeholder = "输入消息..." } = props;
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend?.(inputValue);
      setInputValue("");
      resetInputHeight();
    }
  };
  const resetInputHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={classnames(styles.container, className)}>
      <div className={styles.toolbar}>
        {tools.map((item) => (
          <div key={item.name} className={styles.toolItem}>
            <Iconfont code={item.icon} />
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>
    </div>
  );
}
export default ChatInput;
