import styles from "./index.module.less";
import { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import classnames from "classnames";
import type { ToolItem } from "@/types";
import Iconfont from "@/components/Iconfont";
import Emoji from "@/components/Emoji";
import UploadFile from "@/components/UploadFile";

interface IProps {
  className?: string;
  onSend?: (content: string) => void;
  placeholder?: string;
}

function ChatInput(props: IProps) {
  const { className, onSend, placeholder = "输入消息..." } = props;
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleEmoji = (emoji: string) => {
    setInputValue(inputValue + emoji);
    inputRef.current?.focus();
  };
  const tools: ToolItem[] = [
    {
      name: "emoji",
      icon: "ic:baseline-emoji-emotions",
      component: <Emoji onClick={handleEmoji} />,
    },
    {
      name: "image",
      icon: "ic:baseline-image",
      component: <Iconfont code="ic:baseline-image" />,
    },
    {
      name: "file",
      icon: "ic:baseline-attach-file",
      component: <UploadFile />,
    },
  ];
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
      inputRef.current?.focus();
    }
  };
  const handleToolClick = (name: string) => {
    switch (name) {
      case "emoji":
        break;
      case "file":
        break;
      default:
        break;
    }
  };

  return (
    <div className={classnames(styles.container, className)}>
      <div className={styles.toolbar}>
        {tools.map((item) => (
          <div key={item.name}>{item.component}</div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <Input.TextArea
          name="inputArea"
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
