import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import goalReducer from '../../features/goal/goalSlice';
import transactionReducer from '../../features/transaction/transactionSlice';
import authReducer from '../../features/auth/authSlice';
import GoalForm from './GoalForm';

const server = setupServer(
    http.post('http://localhost:8080/goals', () =>
        HttpResponse.json(
            { id: 1, name: 'Viagem', targetAmount: 3000, startDate: '2026-01-01', deadline: '2026-12-31' },
            { status: 201 }
        )
    )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderForm() {
    const store = configureStore({
        reducer: { auth: authReducer, goals: goalReducer, transactions: transactionReducer },
        preloadedState: {
            auth: { user: null, token: 'test-token', status: 'idle' as const, error: null },
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <GoalForm />
            </MemoryRouter>
        </Provider>
    );

    return store;
}

describe('GoalForm', () => {
    it('não submete o formulário quando campos obrigatórios estão vazios', () => {
        const store = renderForm();
        const dispatchSpy = vi.spyOn(store, 'dispatch');

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(store.getState().goals.goals).toHaveLength(0);
    });

    it('cria a meta com sucesso ao preencher todos os campos obrigatórios', async () => {
        const store = renderForm();

        fireEvent.change(screen.getByLabelText(/nome da meta/i), { target: { value: 'Viagem' } });
        fireEvent.change(screen.getByLabelText(/valor-alvo/i), { target: { value: '3000' } });
        fireEvent.change(screen.getByLabelText(/data-limite/i), { target: { value: '2026-12-31' } });

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(store.getState().goals.goals).toHaveLength(1);
        });
        expect(store.getState().goals.goals[0].name).toBe('Viagem');
    });
});
