import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/hooks/authslice";
import patientSlice from "@/hooks/apptDataSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      authSlice,
      patientSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
