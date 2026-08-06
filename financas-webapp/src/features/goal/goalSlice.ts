import { createSlice } from "@reduxjs/toolkit";
import { fetchGoals, createGoal } from "./goalThunks";
import type { Goal } from "./goalService";

interface GoalState {
    goals: Goal[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GoalState = {
    goals: [],
    status: 'idle',
    error: null,
};

const goalSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGoals.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.goals = action.payload;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createGoal.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.goals.push(action.payload);
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default goalSlice.reducer;
