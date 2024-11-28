// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  name:string;
}
interface PayloadObject{
  token:string|null;
  name:string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  name:"",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<PayloadObject>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      console.log(action.payload.name)
      state.name=action.payload.name;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken')
      localStorage.removeItem('name')
      state.token = null;
      state.name="";
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },
  },
});

export const { login, logout,checkAuth } = authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
