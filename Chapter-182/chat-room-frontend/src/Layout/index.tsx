import { Outlet } from "react-router";
import { ConfigProvider } from "antd";
import { useLayoutEffect } from "react";
import init from "./init/init";
import styles from "./index.module.less";
function Layout() {
  useLayoutEffect(() => {
    console.log("init");
    init();
  }, []);
  return (
    <>
      <ConfigProvider>
        <div className={styles.app}>
          <div className={styles.appBody}>
            <Outlet />
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}
export default Layout;
