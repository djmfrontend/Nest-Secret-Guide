import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { getLocalAuthData } from "@/utils";
import { tokenHeader } from "../config";
import dayjs from "dayjs";
import { updateToken } from "../slices/auth.data";

const whiteList = [
  "guestLogin",
  "login",
  "register",
  "sendLoginMagicLink",
  "sendRegMagicLink",
  "checkEmail",
  "checkMagicTokenValid",
  "getGoogleAuthConfig",
  "getGithubAuthConfig",
  "getSMTPStatus",
  "getLoginConfig",
  "getServerVersion",
  "getServer",
  "getOpenid",
  "getMetamaskNonce",
  "renew",
  "getInitialized",
  "createAdmin",
  "getBotRelatedChannels",
  "sendMessageByBot",
  "getAgoraVoicingList",
  "preCheckFileFromUrl",
];
const errorWhiteList = [
  "preCheckFileFromUrl",
  "getFavoriteDetails",
  "getOGInfo",
  "getArchiveMessage",
];
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  prepareHeaders: (headers, { endpoint }) => {
    const { token } = getLocalAuthData();
    if (token && !whiteList.includes(endpoint)) {
      headers.set(tokenHeader, token);
    }
    return headers;
  },
});
let waitingForRenew: null | any = null;

/**
 * baseQuery封装
 * Token 自动刷新：在 token 即将过期时自动刷新
 * 错误统一处理：对 API 错误进行统一拦截和处理
 * 认证保护：处理 401 未认证等情况，自动跳转登录
 * 并发控制：使用 waitingForRenew 确保同时只有一个续期请求
 * @param args
 * @param api
 * @param extraOptions
 */
const baseQueryWithTokenCheck = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  if (waitingForRenew) {
    await waitingForRenew;
  }
  // 先检查 token 是否过期，过期则 renew [从 localstorage 取]
  const { token, refreshToken, expireTime } = getLocalAuthData();
  console.log(api.endpoint);
  let result: any = null;
  // 20s内

  if (
    !whiteList.includes(api.endpoint) &&
    dayjs().isAfter(new Date(expireTime - 20 * 1000)) // 如果当前时间   过期时间的前20s   14:00:00   14:05:00 14:04:40
  ) {
    // 获取到新的token
    waitingForRenew = baseQuery(
      {
        url: "/token/renew",
        method: "POST",
        body: {
          token,
          refresh_token: refreshToken,
        },
      },
      api,
      extraOptions
    );
    result = await waitingForRenew;
    waitingForRenew = null;
    if (result.data) {
      // store the new token
      api.dispatch(updateToken(result.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      result = await baseQuery(args, api, extraOptions);
    }
  } else {
    result = await baseQuery(args, api, extraOptions);
  }
  if (result?.error) {
    if (errorWhiteList.includes(api.endpoint)) return result;
    // switch (result.error.originalStatus) {
    // }
  }
  return result;
};
export default baseQueryWithTokenCheck;
