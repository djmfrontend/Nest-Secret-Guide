import registerMessage from "./registerMessage";
import { queryUser } from "@/store/user";

const init = async () => {
  registerMessage();
  // 如果当前不在login 页面，则初始化用户信息
  // if (window.location.pathname !== "/login") {
  //   await queryUser();
  // }
};
export default init;
