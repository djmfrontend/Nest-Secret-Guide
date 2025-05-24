export interface IFriendStore {
  friends: IFriend[];
}

export interface IFriend {
  id: number;
  username: string;
  nickName: string;
  headPic: string;
  email: string;
}
