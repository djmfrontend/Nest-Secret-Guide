import { combineReducers, configureStore } from "@reduxjs/toolkit";
import countReducer from "./slices/count";
import messageReducer from "./slices/message";
const reducer = combineReducers({
  count: countReducer,
  message: messageReducer,
});
export const store = configureStore({
  reducer: reducer,
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
