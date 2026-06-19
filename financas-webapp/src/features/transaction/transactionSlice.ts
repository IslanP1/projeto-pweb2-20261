import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions, create, fetchDashboardTransactions } from "./transactionThunk";
import type { Transaction } from "./transactionService";

export interface Category {
    id: number;
    name: string;
}

// Categorias pré-cadastradas no banco (V2__transactions.sql)
export const CATEGORIES: Category[] = [
    { id: 1, name: 'Alimentação' },
    { id: 2, name: 'Aluguel' },
    { id: 3, name: 'Parcelas' },
    { id: 4, name: 'Transporte' },
    { id: 5, name: 'Saúde' },
    { id: 6, name: 'Educação' },
    { id: 7, name: 'Lazer' },
    { id: 8, name: 'Outros' },
];

interface TransactionState {
    transactions: Transaction[];
    dashboardTransactions: Transaction[];
    categories: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    dashboardStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: TransactionState = {
    transactions: [],
    dashboardTransactions: [],
    categories: CATEGORIES,
    status: 'idle',
    dashboardStatus: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 0,
};

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(create.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(create.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(create.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchDashboardTransactions.pending, (state) => {
                state.dashboardStatus = 'loading';
            })
            .addCase(fetchDashboardTransactions.fulfilled, (state, action) => {
                state.dashboardStatus = 'succeeded';
                state.dashboardTransactions = action.payload.content;
            })
            .addCase(fetchDashboardTransactions.rejected, (state) => {
                state.dashboardStatus = 'failed';
            });
    },
});

export default transactionSlice.reducer;
