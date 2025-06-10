import Layout from "../Layout";
import { createBrowserRouter } from "react-router";
import Login from "../views/Login";
import Register from "../views/Register";
import Main from "../views/Main";
import AuthGuard from "@/components/AuthGuard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // 公共路由无需认证
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/",

        element: <AuthGuard />,
        children: [
          {
            index: true,
            element: <Main />,
          },
          {
            path: "friends",
            element: <Main />,
          },
          {
            path: "groupChat",
            element: <Main />,
          },

          {
            path: "/update-info",
            element: <div>update-info</div>,
          },
        ],
      },
    ],
  },
]);
export default router;
