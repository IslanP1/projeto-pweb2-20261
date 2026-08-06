import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import goalReducer from './goalSlice';
import authReducer from '../auth/authSlice';
import { fetchGoals, createGoal } from './goalThunks';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createTestStore() {
    return configureStore({
        reducer: { auth: authReducer, goals: goalReducer },
        preloadedState: {
            auth: { user: null, token: 'test-token', status: 'idle' as const, error: null },
        },
    });
}

describe('goalSlice', () => {
    it('possui o estado inicial esperado', () => {
        expect(goalReducer(undefined, { type: 'unknown' })).toEqual({
            goals: [],
            status: 'idle',
            error: null,
        });
    });

    it('fetchGoals: atualiza status e lista de metas em caso de sucesso', async () => {
        server.use(
            http.get('http://localhost:8080/goals', () =>
                HttpResponse.json([
                    { id: 1, name: 'Viagem', targetAmount: 5000, startDate: '2026-01-01', deadline: '2026-12-31' },
                ])
            )
        );

        const store = createTestStore();
        expect(store.getState().goals.status).toBe('idle');

        await store.dispatch(fetchGoals());

        const state = store.getState().goals;
        expect(state.status).toBe('succeeded');
        expect(state.goals).toHaveLength(1);
        expect(state.goals[0].name).toBe('Viagem');
    });

    it('fetchGoals: atualiza status e erro em caso de falha', async () => {
        server.use(
            http.get('http://localhost:8080/goals', () =>
                HttpResponse.json({ message: 'Não autenticado' }, { status: 401 })
            )
        );

        const store = createTestStore();
        await store.dispatch(fetchGoals());

        const state = store.getState().goals;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Não autenticado');
    });

    it('createGoal: adiciona a meta criada à lista em caso de sucesso', async () => {
        server.use(
            http.post('http://localhost:8080/goals', () =>
                HttpResponse.json(
                    { id: 2, name: 'Reserva de emergência', targetAmount: 10000, startDate: '2026-01-01', deadline: '2026-06-30' },
                    { status: 201 }
                )
            )
        );

        const store = createTestStore();
        await store.dispatch(createGoal({
            name: 'Reserva de emergência',
            targetAmount: 10000,
            deadline: '2026-06-30',
        }));

        const state = store.getState().goals;
        expect(state.status).toBe('succeeded');
        expect(state.goals).toHaveLength(1);
        expect(state.goals[0].name).toBe('Reserva de emergência');
    });
});
