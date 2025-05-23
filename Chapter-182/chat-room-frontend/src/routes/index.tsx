import Layout from "../Layout";
import { createBrowserRouter } from "react-router";
import Login from "../views/Login";
import Register from "../views/Register";
import Main from "../views/Main";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",

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
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/update-info",
        element: <div>update-info</div>,
      },
    ],
  },
]);
export default router;
