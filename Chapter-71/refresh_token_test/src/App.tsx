import axios from "axios";
import { useEffect } from "react";

function App() {
  axios.interceptors.request.use(
    (response) => {
      return response;
    },
    (error) => {
      // 如果accessToken 过期 则请求refresh 接口 获取新的accessToken 如果refreshToken  这跳转至登录页
      let { data, config } = error.response;
      if (data.statusCode === 401) {
        //
      }
    }
  );
  const login = async () => {
    const res = await axios.post("http://localhost:3071/user/login", {
      username: "root",
      password: "123456",
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  };

  const query = async () => {
    await login();
    const res = await axios.get("http://localhost:3071/user/aaa");
    const resb = await axios.get("http://localhost:3071/user/bbb", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log(res.data);
  };
  useEffect(() => {
    query();
  }, []);
  return <div className="App"></div>;
}

export default App;
