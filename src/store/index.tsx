import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import testReducer from "./slice/createTest.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    createTest : testReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
