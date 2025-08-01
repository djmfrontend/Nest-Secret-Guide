import baseQuery from "./base.query";
import type { AuthData, LoginCredential } from "@/types/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { nanoid } from "@reduxjs/toolkit";

import { KEY_DEVICE_ID, KEY_DEVICE_TOKEN } from "@/app/config";
import { updateInitialized } from "@/app/slices/auth.data";
import { setAuthData } from "@/app/slices/auth.data";
const getDeviceId = () => {
  let d = localStorage.getItem(KEY_DEVICE_ID);
  const dt = localStorage.getItem(KEY_DEVICE_TOKEN) || "";
  if (!d) {
    d = `web:${nanoid()}`;
    localStorage.setItem(KEY_DEVICE_ID, d);
  }
  return { device: d, device_token: dt };
};
export const authApi = createApi({
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthData, LoginCredential>({
      query: (credential) => ({
        url: "token/login",
        method: "POST",
        body: {
          credential,
          device: getDeviceId().device,
          device_token: getDeviceId().device_token,
        },
      }),
      transformResponse: (data: AuthData) => {
        const { avatar_updated_at } = data.user;
        return {
          ...data,
          avatar:
            avatar_updated_at == 0
              ? ""
              : `/resource/avatar?uid=${data.user.uid}&t=${avatar_updated_at}`,
        };
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(setAuthData(data));
          }
        } catch {
          console.log("login error");
        }
      },
    }),
    getInitialized: builder.query<boolean, void>({
      query: () => {
        return {
          url: "/admin/system/initialized",
          timeout: 500,
        };
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data: isInitialized } = await queryFulfilled;
          dispatch(updateInitialized(isInitialized));
        } catch {
          dispatch(updateInitialized(true));
        }
      },
    }),
  }),
});

export const { useLoginMutation, useGetInitializedQuery } = authApi;
