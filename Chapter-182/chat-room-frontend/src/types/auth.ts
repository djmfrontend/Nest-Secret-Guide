import type { IUser } from "@/api/type";
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  isLoading: boolean;
}
