import type { IAuthState } from "@/types";
import api from "@/api";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IChatState } from "@/types";

export const useChatStore = create<IChatState>()(
  devtools((set) => ({
    currentFriend: null,
    setCurrentFriend: (friend) =>
      set(() => ({
        currentFriend: friend,
      })),
  }))
);

// export const queryUser = async () => {
//   await useAuthStore.getState().initialize();
// };
