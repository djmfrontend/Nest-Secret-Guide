import twemoji from "twemoji";
import emojis from "emojibase-data/en/data.json";
import styles from "./index.module.less";
import { Popover } from "antd";
import { useState } from "react";
import Iconfont from "@/components/Iconfont";
interface IProps {
  size?: number;
  icon?: string;
  onClick?: (emoji: string) => void;
}
// 暂定 用gropu 为0-10的图标为默认图标
function Emoji(props: IProps) {
  const { size = 24, icon = "ic:baseline-emoji-emotions", onClick } = props;
  const [availableEmojis, setAvailabeEmojis] = useState(emojis);
  const versions = [...new Set(emojis.map((emoji) => emoji.version))];
  const emojioGroup = [...new Set(emojis.map((emoji) => emoji.subgroup))];
  const [visible, setVisible] = useState(false);
  versions.sort((a, b) => b - a);
  const handleClick = (emoji: string) => {
    console.log(emoji);
    setVisible(false);
    //
    onClick && onClick(emoji);
  };
  const content = (
    <div className={styles.wrap}>
      <div className={styles.box}>
        {availableEmojis.map((emoji) => {
          return (
            <span
              className={styles.icon}
              key={emoji.emoji}
              onClick={() => handleClick(emoji.emoji)}
            >
              {emoji.emoji}
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover
      open={visible}
      content={content}
      trigger={["click"]}
      onOpenChange={(visible) => setVisible(visible)}
      placement="top"
    >
      <Iconfont code={icon} size={size} onClick={() => setVisible(!visible)} />
    </Popover>
  );
}

export default Emoji;
