import { Tooltip, Modal } from "antd";
import type React from "react";
import { useState } from "react";
import classnames from "classnames";
import styles from "./index.module.less";
import Iconfont from "@/components/Iconfont";
import BaseSetting from "./BaseSetting";

interface IProps {
  className?: string;
  defaultArouse?: boolean; // 是否默认弹出
  defaultMenu?: number; // 默认选中的菜单
  render?: React.ReactNode;
}

function Setting(props: IProps) {
  const { className, defaultMenu = 0 } = props;
  const [currentMenu, setCurrentMenu] = useState<number>(defaultMenu);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const menusList = [
    {
      label: "基础设置",
      icon: "ic:round-settings",
      body: <BaseSetting />,
      code: "basic",
    },
  ];
  const showModal = (_currentMenu: number = 0) => {
    setIsModalVisible(true);
    setCurrentMenu(_currentMenu);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Tooltip placement="right" title="设置">
        <div
          className={classnames(className, styles.box)}
          onClick={() => showModal()}
        >
          {props.render ? (
            props.render
          ) : (
            <Iconfont code="material-symbols:settings-rounded" size={32} />
          )}
        </div>
      </Tooltip>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={false}
        width={800}
        onOk={handleOk}
        maskClosable={false}
      >
        <div className={styles.modalBox}>
          <div className={styles.menus}>
            <div className={styles.menusTitle}></div>
          </div>
          <div className={styles.menuContent}>
            <div className={classnames(styles.menuContentTitle)}>
              {menusList[currentMenu].label}
            </div>
            {menusList[currentMenu].body}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Setting;
