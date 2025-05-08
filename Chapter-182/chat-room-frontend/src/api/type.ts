export interface Result<T = any> {
  data: T;
  code: number;
  message: string;
}

export interface RequestOptions {
  joinParamsToUrl?: boolean;
}

export type ErrorMessageMode = "none" | "modal" | "message" | undefined;
