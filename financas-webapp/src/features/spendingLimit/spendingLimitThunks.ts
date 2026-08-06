import { createAsyncThunk } from "@reduxjs/toolkit";
import spendingLimitService from "./spendingLimitService";
import type { CreateSpendingLimitDto } from "./spendingLimitService";
import type { RootState } from '../../app/store';
import { invalidateApiCache } from '../../services/serviceWorkerCache';

const fetchSpendingLimits = createAsyncThunk(
    'spendingLimits/fetch',
    async (_: void, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            return await spendingLimitService.fetchAll(token!);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const createSpendingLimit = createAsyncThunk(
    'spendingLimits/create',
    async (data: CreateSpendingLimitDto, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            const result = await spendingLimitService.create(data, token!);
            invalidateApiCache('/spending-limits');
            return result;
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const deleteSpendingLimit = createAsyncThunk(
    'spendingLimits/delete',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            await spendingLimitService.remove(id, token!);
            invalidateApiCache('/spending-limits');
            return id;
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

export { fetchSpendingLimits, createSpendingLimit, deleteSpendingLimit };
