import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import type { AuthResponse } from "./authService";

interface User {
    id: number;
    username: string;
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: AuthState) => {
            state.status = 'loading';
            state.error = null;
        };

        const handleLoginFulfilled = (state: AuthState, action: { payload: AuthResponse }) => {
            const { id, token, username, name } = action.payload;
            state.status = 'succeeded';
            state.token = token;
            state.user = { id, username, name };
            localStorage.setItem('token', token);
        };

        const handleRegisterFulfilled = (state: AuthState) => {
            state.status = 'succeeded';
        };

        const handleRejected = (state: AuthState, action: { payload: unknown}) => {
            state.status = 'failed';
            state.error = action.payload as string;
        }

        builder
            .addCase(login.pending, handlePending)
            .addCase(login.fulfilled, handleLoginFulfilled)
            .addCase(login.rejected, handleRejected)
            .addCase(register.pending, handlePending)
            .addCase(register.fulfilled, handleRegisterFulfilled)
            .addCase(register.rejected, handleRejected)
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;