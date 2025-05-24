import { useFriendStore } from "../store/friends";
import classnames from "classnames";

import { Dropdown } from "antd";
import styles from "./index.module.less";
import { useState } from "react";
import { set } from "lodash";

const FriendsPage = () => {
  const friends = useFriendStore((state) => state.friends);
  const [activeId, setActiveId] = useState<number | null>(null);
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
  return (
    <div className={styles.box}>
      <div className={styles.layoutLeft}>
        <div className={styles.pageTitle}>好友</div>
        <div className={styles.menuBox}>{renderFriendsList()}</div>
      </div>
    </div>
  );
};

export default FriendsPage;
