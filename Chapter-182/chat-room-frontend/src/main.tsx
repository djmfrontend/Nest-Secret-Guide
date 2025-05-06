import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import {
  BrowserRouter,
  Routes,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router";
import router from "./routes/index.tsx";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>
);
