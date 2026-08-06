import type { RootState } from '../../app/store';

export const selectGoals = (state: RootState) => state.goals.goals;
export const selectGoalStatus = (state: RootState) => state.goals.status;
export const selectGoalError = (state: RootState) => state.goals.error;

// ─── Selector derivado de progresso (RF05) ───────────────────────────────────
// Calcula o percentual atingido de uma meta com base nas receitas registradas
// no slice de transações, sem manter um slice próprio para o progresso.

export const selectGoalProgress = (goalId: number) => (state: RootState) => {
    const goal = state.goals.goals.find((g) => g.id === goalId);
    if (!goal) return 0;

    const income = state.transactions.dashboardTransactions
        .filter((t) =>
            t.type === 'INCOME' &&
            t.date >= goal.startDate &&
            t.date <= goal.deadline &&
            (!goal.categoryId || t.categoryId === goal.categoryId)
        )
        .reduce((sum, t) => sum + t.amount, 0);

    if (goal.targetAmount <= 0) return 0;

    return Math.min(100, (income / goal.targetAmount) * 100);
};
