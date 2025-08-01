import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authDataReducer from "@/app/slices/auth.data";
import { authApi } from "@/app/service/auth";
import type { TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";

const reducre = combineReducers({
  authData: authDataReducer,
  [authApi.reducerPath]: authApi.reducer,
});
const store = configureStore({
  reducer: reducre,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
