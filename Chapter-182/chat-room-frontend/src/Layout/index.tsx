import { Outlet } from "react-router";
import { ConfigProvider } from "antd";
import { useLayoutEffect } from "react";
import init from "./init/init";
function Layout() {
  useLayoutEffect(() => {
    init();
  }, []);
  return (
    <>
      <ConfigProvider>
        <Outlet></Outlet>
      </ConfigProvider>
    </>
  );
}
export default Layout;
