// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading:boolean;
}
interface PayloadObject{
  token:string|null;
  name:string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  isLoading:true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<PayloadObject>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      console.log(action.payload.name)
      state.isLoading=false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken')
      localStorage.removeItem('name')
      state.token = null;
      state.isLoading=false;
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },
    setIsLoading:(state)=>{
      state.isLoading=!state.isLoading;
    }
  },
});

export const { login, logout,checkAuth,setIsLoading } = authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
