import { configureStore } from "@reduxjs/toolkit";
import libraryReducer from "./features/library-slice";

export const store = configureStore({
  reducer: {
    library: libraryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;