import { describe, expect, it } from 'vitest';
import type { RootState } from '../../app/store';
import type { Goal } from './goalService';
import type { Transaction } from '../transaction/transactionService';
import { selectGoalProgress } from './goalSelectors';

const goal: Goal = {
    id: 1,
    name: 'Viagem',
    targetAmount: 1000,
    startDate: '2026-01-01',
    deadline: '2026-12-31',
};

function buildState(dashboardTransactions: Transaction[]): RootState {
    return {
        goals: { goals: [goal], status: 'idle', error: null },
        transactions: {
            transactions: [],
            dashboardTransactions,
            categories: [],
            status: 'idle',
            dashboardStatus: 'idle',
            categoriesStatus: 'idle',
            error: null,
            currentPage: 0,
            totalPages: 0,
        },
    } as unknown as RootState;
}

describe('selectGoalProgress', () => {
    it('retorna 0% quando não há receitas registradas no período da meta', () => {
        const state = buildState([]);

        expect(selectGoalProgress(goal.id)(state)).toBe(0);
    });

    it('retorna o percentual parcial com base nas receitas do período', () => {
        const state = buildState([
            { id: 1, amount: 300, type: 'INCOME', categoryId: 1, categoryName: 'Salário', date: '2026-03-01' },
        ]);

        expect(selectGoalProgress(goal.id)(state)).toBe(30);
    });

    it('limita o percentual a 100% quando a meta é atingida ou superada', () => {
        const state = buildState([
            { id: 1, amount: 1500, type: 'INCOME', categoryId: 1, categoryName: 'Salário', date: '2026-03-01' },
        ]);

        expect(selectGoalProgress(goal.id)(state)).toBe(100);
    });
});
