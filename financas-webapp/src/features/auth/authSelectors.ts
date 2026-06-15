import type { RootState } from '../../app/store';

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;