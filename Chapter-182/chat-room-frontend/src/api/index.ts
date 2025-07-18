import createRequest from "./base";
import type { ILogin, IRegister, IUser } from "./type";
import type { IFriend, OssFileResponse } from "@/types";
import type { IAi } from "@/types/ai";

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
// 请求AI
const aiStream = createRequest<IAi, any>("/ai/stream", {
  method: "post",
});
// 获取聊天记录

// export const getChatHistory = createRequest<{ chatRoomId: number }, any>(
//   "/chat-history/list",
//   {
//     method: "get",
//   }
// );

const ossImageUrl = createRequest<{ key: string }, OssFileResponse>(
  "/oss/json",
  {
    method: "get",
  }
);
const updateUserInfo = createRequest<{
  headPic: string;
  nickName: string;
  email: string;
}>("/user/update_info", {
  method: "post",
});

const getHistoryMessage = createRequest<{
  chatRoomId: string;
  page: number;
  pageSize: number;
}>("/chat-history/list", {
  method: "post",
});
export default {
  userLogin,
  sendCaptcha,
  userRegister,
  userFriends,
  userInfo,
  aiStream,
  ossImageUrl,
  updateUserInfo,
};
