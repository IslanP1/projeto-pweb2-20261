import { createAsyncThunk } from "@reduxjs/toolkit";
import goalService from "./goalService";
import type { CreateGoalDto } from "./goalService";
import type { RootState } from '../../app/store';

const fetchGoals = createAsyncThunk(
    'goals/fetch',
    async (_: void, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            return await goalService.fetchAll(token!);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const createGoal = createAsyncThunk(
    'goals/create',
    async (data: CreateGoalDto, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            return await goalService.create(data, token!);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

export { fetchGoals, createGoal };
