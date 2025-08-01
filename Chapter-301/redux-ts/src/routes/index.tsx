import { Provider } from "react-redux";
import store from "@/app/store";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import "@/assets/index.css";
const LoginPage = lazy(() => import("./login/index"));
import RequireNoAuth from "@/components/RequireNoAuth";
import Files from "./files";
import FavsPage from "./favs";
const PageRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RequireNoAuth>
              <LoginPage />
            </RequireNoAuth>
          }
        ></Route>
        <Route key={"main"} path="/" element={<div>home2</div>}>
          <Route path="files" element={<Files />}></Route>
          <Route key="users"></Route>
          <Route key="favs" element={<FavsPage />}></Route>
          <Route key="setting"></Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};
function ReduxRoutes() {
  return (
    <>
      <Provider store={store}>
        <PageRoutes />
      </Provider>
    </>
  );
}

export default ReduxRoutes;
