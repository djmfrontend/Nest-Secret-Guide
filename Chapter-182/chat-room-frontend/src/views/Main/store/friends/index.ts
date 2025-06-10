import type { IFriend, IFriendStore } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "@/api";

export const initFriendsStore: IFriendStore = {
  friends: [],
};

export const useFriendStore = create<IFriendStore>()(
  devtools(() => initFriendsStore)
);

export const getFriends: () => Promise<IFriend[]> = () => {
  console.log("222222");
  return new Promise((resolve, reject) => {
    api
      .userFriends()
      .then((res) => {
        useFriendStore.setState({
          friends: res,
        });
        resolve(res);
      })
      .catch(() => {
        reject([]);
      });
  });
};
