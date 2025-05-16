import type { IMainStore } from "@/types";
import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
const initMainStore = {
  mainPageActiveTab: "friends",
};
export const useMainStore = create<IMainStore>()(
  devtools(
    persist(() => initMainStore, {
      name: "main-page-store",
    })
  )
);
export const setMainPageActiveTab = (mainPageActiveTab: string) => {
  return useMainStore.setState({ mainPageActiveTab });
};
