import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@/libs/redux/slices/app.slice";
import zaloDetailReducer from "@/libs/redux/slices/zaloDetail.slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    zaloDetail: zaloDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
