import type { IAuthState } from "@/types";
import api from "@/api";
import { create } from "zustand";

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  initialize: async () => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      try {
        set({ isLoading: true });
        const user = await api.userInfo();
        set({
          user: user,
          token,
          isAuthenticated: !!token,
          isLoading: false,
        });
      } catch (e) {
        console.error("Failed to initialize auth:", e);
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  },
  login: async (username, password) => {
    const res = await api.userLogin({
      username,
      password,
    });
    localStorage.setItem("token", res.token);
    set({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
    });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
