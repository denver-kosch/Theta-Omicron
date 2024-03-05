import { createSlice } from "@reduxjs/toolkit";

const loginValidationSlice = createSlice({
    name: 'TokenValidation',
    initialState: {
      token: '',
    },
    reducers: {
      setToken: (state, token) => {
        state.token = token.payload;
      },
      clear: (state) => {
        state.token = '';
      },
    }
  });
  
  export const { setToken, clear, } = loginValidationSlice.actions
  export default loginValidationSlice.reducer