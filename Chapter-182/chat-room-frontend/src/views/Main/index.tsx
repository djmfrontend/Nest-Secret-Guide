import BrandLogo from "@/components/BrandLogo";
import Iconfont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useState, useEffect } from "react";
import type { INavItem } from "@/types";
import { Tooltip } from "antd";
import classnames from "classnames";
import { useMainStore, setMainPageActiveTab } from "./store/main";
import FriendsPage from "./friends";
import { getFriends } from "./store/friends";
import GroupChatPage from "./groupChat";

function Main() {
  const initNavConfig: INavItem[] = [
    {
      icon: "mdi:account-group",
      name: "好友",
      isLoad: false,
      key: "friends",
      iconFontSize: 32,
      component: <FriendsPage />,
    },
    {
      icon: "mdi:chat-processing-outline",
      name: "群聊",
      isLoad: false,
      key: "groupChat",
      iconFontSize: 32,
      component: <GroupChatPage />,
    },
  ];
  const mainPageActiveTab = useMainStore((state) => state.mainPageActiveTab);
  const [activeNavKey, setActiveNavKey] = useState<string>(
    window.location.pathname.split("/")[1] || mainPageActiveTab
  );

  const switchingNav = (key: string) => {
    console.log(key);
    setActiveNavKey(key);
    setMainPageActiveTab(key);
  };
  // 切换tab
  useEffect(() => {
    // 获取当前地址栏的tab
    const activeIndex = navConfig.findIndex((t) => `${t.key}` === activeNavKey);
    if (activeIndex > -1) {
      navConfig[activeIndex].isLoad = true;
      setNavConfig([...navConfig]);
      // if (__ENV__ !== "desktop") {
      //   const href = window.location.origin + "/" + activeNavKey;
      //   window.history.pushState({}, "", href);
      // }
      const href = window.location.origin + "/" + activeNavKey;
      window.history.pushState({}, "", href);
    }
  }, [activeNavKey]);

  useEffect(() => {
    switchingNav(mainPageActiveTab);
  }, []);
  useEffect(() => {
    getFriends();
    // 调用用户好友列表
  }, []);
  const [navConfig, setNavConfig] = useState<INavItem[]>(initNavConfig);
  return (
    <div className={styles.page}>
      <div className={styles.layoutLeft}>
        <BrandLogo />
        <ul className={styles.navList}>
          {navConfig.map((item) => {
            return (
              <Tooltip key={item.key} title={item.name} placement="right">
                <li
                  className={classnames({
                    [styles.activeNav]: item.key == activeNavKey,
                  })}
                  onClick={() => switchingNav(item.key)}
                >
                  <Iconfont
                    code={item.icon}
                    size={item.iconFontSize}
                    className={styles.icon}
                  />
                </li>
              </Tooltip>
            );
          })}
        </ul>
      </div>
      <div className={styles.layoutRight}>
        {navConfig.map((item) => {
          return (
            <div
              key={item.key}
              className={styles.componentBox}
              hidden={activeNavKey !== item.key}
            >
              {item.isLoad ? item.component : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Main;
