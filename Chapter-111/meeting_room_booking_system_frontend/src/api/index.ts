import base from "./base";

const login = (username: string, password: string) =>
  base.post("/user/login", {
    username,
    password,
  });
export { login };
