import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import goalReducer from '../features/goal/goalSlice';
import spendingLimitReducer from '../features/spendingLimit/spendingLimitSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        goals: goalReducer,
        spendingLimits: spendingLimitReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
