import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Contact } from "@/types/user";
import type { AuthData, RenewTokenResponse } from "@/types/auth";
type DMAside = "voice" | null;
import {
  KEY_LOGIN_USER,
  KEY_TOKEN,
  KEY_EXPIRE,
  KEY_REFRESH_TOKEN,
  KEY_UID,
} from "../config";
export interface StoredUser extends Contact {
  online?: boolean;
  voice?: boolean;
  avatar?: string;
  visibleAside?: DMAside;
}
interface State {
  initialized: boolean;
  guest: boolean;
  user: StoredUser | undefined;
  token: string;
  expireTime: number;
  refreshToken: string;
  roleChanged: boolean;
  voice: boolean;
}
const emptyState: State = {
  initialized: true,
  guest: false,
  user: undefined,
  token: "",
  expireTime: +new Date(),
  refreshToken: "",
  roleChanged: false,
  voice: false,
};
const loginUser = localStorage.getItem(KEY_LOGIN_USER) || "";
const initialState: State = {
  initialized: true,
  guest: loginUser ? JSON.parse(loginUser).create_by == "guest" : false,
  user: loginUser ? JSON.parse(loginUser) : undefined,
  token: localStorage.getItem(KEY_TOKEN) || "",
  expireTime: Number(localStorage.getItem(KEY_EXPIRE) || +new Date()),
  refreshToken: localStorage.getItem(KEY_REFRESH_TOKEN) || "",
  roleChanged: false,
  voice: false,
};
const authDataSlice = createSlice({
  name: "authData",
  initialState: initialState,
  reducers: {
    setAuthData(state, { payload }: PayloadAction<AuthData>) {
      const {
        initialized = true,
        user,
        token,
        refresh_token,
        expired_in = 0,
      } = payload;
      const { uid, create_by } = user;
      state.initialized = initialized;
      state.user = { ...state.user, ...user, status: "added" };
      state.guest = create_by == "guest";
      state.token = token;
      state.refreshToken = refresh_token;
      // 当前时间往后推 expire 时长
      const expireTime = +new Date() + Number(expired_in) * 1000;
      state.expireTime = expireTime;
      localStorage.setItem(KEY_LOGIN_USER, JSON.stringify(user));
      localStorage.setItem(KEY_EXPIRE, `${expireTime}`);
      localStorage.setItem(KEY_TOKEN, token);
      localStorage.setItem(KEY_REFRESH_TOKEN, refresh_token);
      localStorage.setItem(KEY_UID, `${uid}`);
    },
    updateToken(state, action: PayloadAction<RenewTokenResponse>) {
      const { token, refresh_token, expired_in } = action.payload;
      state.token = token;
      const et = +new Date() + Number(expired_in) * 1000;
      state.expireTime = et;
      state.refreshToken = refresh_token;
      localStorage.setItem(KEY_EXPIRE, `${et}`);
      localStorage.setItem(KEY_TOKEN, token);
      localStorage.setItem(KEY_REFRESH_TOKEN, refresh_token);
    },
    updateInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
  },
});
export const { setAuthData, updateToken, updateInitialized } =
  authDataSlice.actions;
export default authDataSlice.reducer;
