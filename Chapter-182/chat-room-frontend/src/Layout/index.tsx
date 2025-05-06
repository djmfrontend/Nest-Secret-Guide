import { Outlet } from "react-router";
import { ConfigProvider } from "antd";
function Layout() {
  return (
    <>
      <ConfigProvider>
        <Outlet></Outlet>
      </ConfigProvider>
    </>
  );
}
export default Layout;
