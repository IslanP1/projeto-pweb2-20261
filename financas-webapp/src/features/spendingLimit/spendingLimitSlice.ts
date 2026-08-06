import { createSlice } from "@reduxjs/toolkit";
import { fetchSpendingLimits, createSpendingLimit, deleteSpendingLimit } from "./spendingLimitThunks";
import type { SpendingLimit } from "./spendingLimitService";

interface SpendingLimitState {
    limits: SpendingLimit[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SpendingLimitState = {
    limits: [],
    status: 'idle',
    error: null,
};

const spendingLimitSlice = createSlice({
    name: 'spendingLimits',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSpendingLimits.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSpendingLimits.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.limits = action.payload;
            })
            .addCase(fetchSpendingLimits.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createSpendingLimit.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createSpendingLimit.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.limits.push(action.payload);
            })
            .addCase(createSpendingLimit.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteSpendingLimit.fulfilled, (state, action) => {
                state.limits = state.limits.filter((l) => l.id !== action.payload);
            });
    },
});

export default spendingLimitSlice.reducer;
