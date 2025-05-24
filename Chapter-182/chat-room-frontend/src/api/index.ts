import createRequest from "./base";
import type { ILogin, IRegister, IFriend } from "./type";

/** 用户登录接口 */
const userLogin = createRequest<{ username: string; password: string }, ILogin>(
  "/user/login",
  {
    method: "post",
  }
);
const sendCaptcha = createRequest<{ address: string }, string>(
  "/user/register-captcha",
  {
    method: "get",
  }
);

const userRegister = createRequest<IRegister, any>("/user/register", {
  method: "post",
});
const userFriends = createRequest<void, IFriend[]>("/user/friendship", {
  method: "get",
});
export default { userLogin, sendCaptcha, userRegister, userFriends };
