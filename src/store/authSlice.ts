import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the auth state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

// Create the slice
const authSlice = createSlice({ 
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state: AuthState, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    loginFailure(state: AuthState, action: PayloadAction<string>) {
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout(state:AuthState) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
