import { createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from "./transactionService";
import type { CreateTransactionDto } from "./transactionService";
import type { RootState } from '../../app/store';

const create = createAsyncThunk(
    'transactions',
    async (data: CreateTransactionDto, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            return await transactionService.create(data, token!);
        } catch (e) {   
            return rejectWithValue((e as Error).message);
        }
    }
);

export {
    create,
};