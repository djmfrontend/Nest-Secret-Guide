import { createRoot } from "react-dom/client";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
import { RouterProvider } from "react-router";
import router from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>
);
