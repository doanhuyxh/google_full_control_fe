import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@/libs/redux/slices/app.slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
