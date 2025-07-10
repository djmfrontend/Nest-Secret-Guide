import { useFriendStore } from "../store/friends";
import classnames from "classnames";
import { useChatStore } from "@/store/chat";
import { Dropdown } from "antd";
import styles from "./index.module.less";
import { useState } from "react";
import { useAuthStore } from "@/store/user";

import ChatWindow from "@/components/ChatWindow";

const FriendsPage = () => {
  const friends = useFriendStore((state) => state.friends);
  const [activeId, setActiveId] = useState<number | null>(null);
  const { user } = useAuthStore();
  const { setCurrentFriend, currentFriend } = useChatStore();
  const renderFriendsList = () => {
    return friends?.map((t) => {
      return (
        <Dropdown key={t.id} trigger={["contextMenu"]}>
          <div
            className={classnames(styles.menuItem, {
              [styles.menuItemActive]: activeId === t.id,
            })}
            onClick={() => {
              setActiveId(t.id);
              setCurrentFriend(t);
            }}
          >
            <div className={classnames(styles.menuItemsTitle)}>
              <span className={styles.name}>{t.nickName}</span>
            </div>
          </div>
        </Dropdown>
      );
    });
  };
  // const friend = friends.find((item) => item.id === activeId);
  // 点击时 获取最近的聊天记录 传递给  chatWindow
  return (
    <div className={styles.box}>
      <div className={styles.layoutLeft}>
        <div className={styles.pageTitle}>好友 {user?.nickName}</div>
        <div className={styles.menuBox}>{renderFriendsList()}</div>
      </div>
      <div className={styles.layoutRight}>
        {currentFriend ? <ChatWindow friend={currentFriend} /> : null}
      </div>
    </div>
  );
};

export default FriendsPage;
