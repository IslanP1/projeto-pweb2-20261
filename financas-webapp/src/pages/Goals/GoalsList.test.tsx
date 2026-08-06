import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import goalReducer from '../../features/goal/goalSlice';
import transactionReducer from '../../features/transaction/transactionSlice';
import authReducer from '../../features/auth/authSlice';
import GoalsList from './GoalsList';

const fixtureGoals = [
    { id: 1, name: 'Viagem', targetAmount: 5000, startDate: '2026-01-01', deadline: '2026-12-31' },
    { id: 2, name: 'Carro novo', targetAmount: 20000, startDate: '2026-01-01', deadline: '2026-12-31' },
];

const fixtureIncome = [
    { id: 1, amount: 2500, type: 'INCOME' as const, categoryId: 1, categoryName: 'Salário', date: '2026-03-01' },
];

const server = setupServer(
    http.get('http://localhost:8080/goals', () => HttpResponse.json(fixtureGoals)),
    http.get('http://localhost:8080/transactions', () =>
        HttpResponse.json({ content: fixtureIncome, totalPages: 1, totalElements: 1, number: 0, size: 200 })
    )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithFixtures() {
    const store = configureStore({
        reducer: { auth: authReducer, goals: goalReducer, transactions: transactionReducer },
        preloadedState: {
            auth: { user: null, token: 'test-token', status: 'idle' as const, error: null },
            goals: { status: 'succeeded' as const, error: null, goals: fixtureGoals },
            transactions: {
                transactions: [],
                dashboardTransactions: fixtureIncome,
                categories: [],
                status: 'idle' as const,
                dashboardStatus: 'succeeded' as const,
                categoriesStatus: 'idle' as const,
                error: null,
                currentPage: 0,
                totalPages: 0,
            },
        },
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <GoalsList />
            </MemoryRouter>
        </Provider>
    );
}

describe('GoalsList', () => {
    it('renderiza a listagem com as metas de fixture e seu progresso', () => {
        renderWithFixtures();

        expect(screen.getByText('Viagem')).toBeInTheDocument();
        expect(screen.getByText('Carro novo')).toBeInTheDocument();
        // Progresso da meta "Viagem": R$2500 de receita / R$5000 de alvo = 50%
        expect(screen.getByText('50%')).toBeInTheDocument();
    });
});
