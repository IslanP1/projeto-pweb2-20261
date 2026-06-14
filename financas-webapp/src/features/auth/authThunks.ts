import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const login = createAsyncThunk(
    'auth/login',
    async (creds: { username: string; password: string }, { rejectWithValue }) => {
        try {
            return await authService.login(creds.username, creds.password);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const register = createAsyncThunk(
    'auth/register',
    async (creds: { username: string; password: string; name: string }, { rejectWithValue }) => {
        try {
            return await authService.register(creds.username, creds.password, creds.name);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

export const authThunks = {
    login,
    register
};