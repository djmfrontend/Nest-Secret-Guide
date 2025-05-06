import Layout from "../Layout";
import { createBrowserRouter } from "react-router";
import Login from "../views/Login";
import Register from "../views/Register";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
export default router;
