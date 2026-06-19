import type { RootState } from '../../app/store';

export const selectTransactions = (state: RootState) =>
    state.transactions.transactions;

export const selectTransactionStatus = (state: RootState) =>
    state.transactions.status;

export const selectTransactionError = (state: RootState) =>
    state.transactions.error;

export const selectCurrentPage = (state: RootState) =>
    state.transactions.currentPage;

export const selectTotalPages = (state: RootState) =>
    state.transactions.totalPages;

export const selectCategories = (state: RootState) =>
    state.transactions.categories;

export const selectDashboardStatus = (state: RootState) =>
    state.transactions.dashboardStatus;

// ─── Selectors derivados para o dashboard (RF03) ─────────────────────────────

function currentMonthPrefix() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
}

export const selectCurrentMonthIncome = (state: RootState) => {
    const prefix = currentMonthPrefix();
    return state.transactions.dashboardTransactions
        .filter(t => t.date.startsWith(prefix) && t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
};

export const selectCurrentMonthExpense = (state: RootState) => {
    const prefix = currentMonthPrefix();
    return state.transactions.dashboardTransactions
        .filter(t => t.date.startsWith(prefix) && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
};

export const selectCurrentMonthBalance = (state: RootState) =>
    selectCurrentMonthIncome(state) - selectCurrentMonthExpense(state);

export const selectRecentTransactions = (state: RootState) =>
    state.transactions.dashboardTransactions.slice(0, 5);

// ─── RF04 — Gastos por categoria do mês atual ────────────────────────────────

export const selectExpensesByCategory = (state: RootState) => {
    const prefix = currentMonthPrefix();
    const grouped = new Map<number, { name: string; total: number }>();

    state.transactions.dashboardTransactions
        .filter(t => t.date.startsWith(prefix) && t.type === 'EXPENSE')
        .forEach(t => {
            const entry = grouped.get(t.categoryId);
            if (entry) {
                entry.total += t.amount;
            } else {
                grouped.set(t.categoryId, { name: t.categoryName, total: t.amount });
            }
        });

    return Array.from(grouped.values()).sort((a, b) => b.total - a.total);
};

// ─── Relatórios — dados mensais agregados ────────────────────────────────────

export type MonthlyData = {
    month: string;   // 'YYYY-MM'
    label: string;   // 'Jun 26'
    income: number;
    expense: number;
};

function monthLabel(yearMonth: string): string {
    const [year, mon] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(mon) - 1, 1);
    const str = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
    return str.charAt(0).toUpperCase() + str.slice(1).replace('.', '');
}

export const selectMonthlyData = (state: RootState): MonthlyData[] => {
    const grouped = new Map<string, { income: number; expense: number }>();

    for (const t of state.transactions.dashboardTransactions) {
        const month = t.date.substring(0, 7);
        const entry = grouped.get(month) ?? { income: 0, expense: 0 };
        if (t.type === 'INCOME') {
            entry.income += t.amount;
        } else {
            entry.expense += t.amount;
        }
        grouped.set(month, entry);
    }

    return Array.from(grouped.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, label: monthLabel(month), ...data }));
};
