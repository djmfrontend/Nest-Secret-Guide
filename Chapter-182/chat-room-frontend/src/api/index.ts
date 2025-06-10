import createRequest from "./base";
import type { ILogin, IRegister, IUser } from "./type";
import type { IFriend } from "@/types";

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
const userInfo = createRequest<void, IUser>("/user/info", {
  method: "get",
});
// 获取聊天记录

// export const getChatHistory = createRequest<{ chatRoomId: number }, any>(
//   "/chat-history/list",
//   {
//     method: "get",
//   }
// );

export default { userLogin, sendCaptcha, userRegister, userFriends, userInfo };
