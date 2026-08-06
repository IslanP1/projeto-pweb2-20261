import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import goalReducer from '../features/goal/goalSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        goals: goalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
