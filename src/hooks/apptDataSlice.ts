import { createSlice } from "@reduxjs/toolkit";

export interface PateintState {
  id: string;
  
}

const initialState: PateintState = {
  id: "",

};

export const patientSlice = createSlice({
  name: "patient session",
  initialState,
  reducers: {
    patientHandler: (state, action) => {
      state.id = action.payload.id;
     
    },
  },
});

export const { patientHandler } = patientSlice.actions;

export default patientSlice.reducer;
