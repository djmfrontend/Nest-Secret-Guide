import axios, { Axios } from "axios";
import type { AxiosRequestConfig } from "axios";
export interface ApiResponse<T = void> {
  code: number;
  message: string;
  data: T;
}
const instance = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

instance.interceptors.request.use((config) => {
  return config;
});

instance.interceptors.response.use((response) => {
  return response.data;
});
export default instance;

export function request<T = void, R = void>(config: AxiosRequestConfig) {
  return instance.request<T, ApiResponse<R>>(config);
}

const demo = () => {
  return request<{ user: string; name: string }, { data: number }>({
    url: "/api/demo",
    method: "get",
  });
};

demo().then((res) => {
  console.log(res);
});
