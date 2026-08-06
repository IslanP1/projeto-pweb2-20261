import type { RootState } from '../../app/store';

export const selectSpendingLimits = (state: RootState) => state.spendingLimits.limits;
export const selectSpendingLimitStatus = (state: RootState) => state.spendingLimits.status;
export const selectSpendingLimitError = (state: RootState) => state.spendingLimits.error;

export interface SpendingStatus {
    categoryId: number;
    categoryName: string;
    limitAmount: number;
    spent: number;
    percentUsed: number;
}

function currentMonthPrefix() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
}

// ─── Selector derivado de status de gastos (RF06) ────────────────────────────
// Cruza os limites definidos com as transações de despesa do mês atual,
// sem manter um slice próprio para o status.

export const selectSpendingStatus = (state: RootState): SpendingStatus[] => {
    const prefix = currentMonthPrefix();
    const spentByCategory = new Map<number, number>();

    state.transactions.dashboardTransactions
        .filter((t) => t.date.startsWith(prefix) && t.type === 'EXPENSE')
        .forEach((t) => {
            spentByCategory.set(t.categoryId, (spentByCategory.get(t.categoryId) ?? 0) + t.amount);
        });

    return state.spendingLimits.limits.map((limit) => {
        const spent = spentByCategory.get(limit.categoryId) ?? 0;
        return {
            categoryId: limit.categoryId,
            categoryName: limit.categoryName,
            limitAmount: limit.limitAmount,
            spent,
            percentUsed: limit.limitAmount > 0 ? (spent / limit.limitAmount) * 100 : 0,
        };
    });
};

export const selectSpendingStatusForCategory = (categoryId: number | null) => (state: RootState) => {
    if (categoryId === null) return undefined;
    return selectSpendingStatus(state).find((s) => s.categoryId === categoryId);
};
