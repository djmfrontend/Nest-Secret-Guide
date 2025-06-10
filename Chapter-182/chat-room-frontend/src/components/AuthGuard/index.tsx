import { useAuthStore } from "@/store/user";
import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router";
import Main from "@/views/Main";
export default function AuthGuard() {
  const navigate = useNavigate();
  const { initialize, isAuthenticated, isLoading } = useAuthStore();

  // 初始化认证状态
  useEffect(() => {
    initialize();
  }, []);

  // 监听 `isLoading` 和 `isAuthenticated` 的变化
  useEffect(() => {
    console.log("isLoading:", isLoading);
    if (!isLoading) {
      const isPublicPath = ["/login", "/register"].some((path) =>
        window.location.pathname.includes(path)
      );

      //未认证且不在白名单 → 跳转登录页
      if (!isAuthenticated && !isPublicPath) {
        navigate("/login", { replace: true });
      }
      // 已认证但访问登录/注册页 → 跳转首页
      if (isAuthenticated && isPublicPath) {
        navigate("/", { replace: true });
      }
    }
  }, [isLoading, isAuthenticated]); // 监听这两个状态的变化

  // 加载中 → 显示 Loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 否则 → 渲染子路由
  return <Main />;
}
