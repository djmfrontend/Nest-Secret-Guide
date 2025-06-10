export interface Result<T = any> {
  data: T;
  code: number;
  message: string;
}

export interface RequestOptions {
  joinParamsToUrl?: boolean;
  ignoreCancelToken?: boolean;
}

export type ErrorMessageMode = "none" | "modal" | "message" | undefined;

export interface IUser {
  captcha: string;
  createdTime: string;
  email: string;
  headPic: string;
  id: number;
  nickName: string;
  updatedTime: string;
  username: string;
}
export interface ILogin {
  token: string;
  user: IUser;
}

export interface IRegister {
  username: string;
  password: string;
  nickName: string;
  email: string;
  captcha: string;
}
