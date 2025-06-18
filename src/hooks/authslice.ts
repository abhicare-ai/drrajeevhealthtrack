import { createSlice } from "@reduxjs/toolkit";
import { Session } from "inspector/promises";
import { User } from "lucia";

export interface LoginState {
  user: User | null;
  session: Session | null;
}

const initialState: LoginState = {
  user: null,
  session: null,
};

export const authSlice = createSlice({
  name: "login session",
  initialState,
  reducers: {
    sessionHandler: (state, actions) => {
      state.user = actions.payload.user;
      state.session = actions.payload.session;
    },
  },
});

export const { sessionHandler } = authSlice.actions;

export default authSlice.reducer;
