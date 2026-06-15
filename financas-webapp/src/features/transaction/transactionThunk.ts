import { createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from "./transactionService";
import type { CreateTransactionDto } from "./transactionService";
import type { RootState } from '../../app/store';

const create = createAsyncThunk(
    'transactions/create',
    async (data: CreateTransactionDto, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            return await transactionService.create(data, token!);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);

const fetchTransactions = createAsyncThunk(
    'transactions/fetch',
    async (page: number, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            return await transactionService.fetchAll(page, token!);
        } catch (e) {
            return rejectWithValue((e as Error).message);
        }
    }
);


export { create, fetchTransactions };
