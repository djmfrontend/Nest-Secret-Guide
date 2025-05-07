import instance from "./base";

const login = async (username: string, password: string) => {
  return await instance.post("/user/login", {
    username,
    password,
  });
};
export default { login };
