import { KEY_TOKEN, KEY_REFRESH_TOKEN, KEY_EXPIRE } from "@/app/config";

export const getLocalAuthData = () => {
  return {
    token: localStorage.getItem(KEY_TOKEN) || "",
    refreshToken: localStorage.getItem(KEY_REFRESH_TOKEN) || "",
    expireTime: Number(localStorage.getItem(KEY_EXPIRE) || +new Date()),
  };
};
