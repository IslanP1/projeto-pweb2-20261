import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiTarget } from 'react-icons/fi';
import type { AppDispatch } from '../../app/store';
import { fetchGoals } from '../../features/goal/goalThunks';
import { fetchDashboardTransactions } from '../../features/transaction/transactionThunk';
import { selectGoalProgress, selectGoalStatus, selectGoals } from '../../features/goal/goalSelectors';
import { selectDashboardStatus } from '../../features/transaction/transactionSelectors';
import type { Goal } from '../../features/goal/goalService';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

export default function GoalsList() {
    const dispatch = useDispatch<AppDispatch>();
    const goals = useSelector(selectGoals);
    const status = useSelector(selectGoalStatus);
    const dashboardStatus = useSelector(selectDashboardStatus);

    useEffect(() => {
        dispatch(fetchGoals());
        if (dashboardStatus === 'idle') {
            dispatch(fetchDashboardTransactions());
        }
    }, [dispatch, dashboardStatus]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Metas Financeiras</h1>
                <Link
                    to="/goals/new"
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    <FiPlus /> Nova meta
                </Link>
            </div>

            {status === 'loading' && goals.length === 0 && (
                <div className="rounded-2xl bg-white py-12 text-center shadow-sm">
                    <p className="text-gray-400">Carregando...</p>
                </div>
            )}

            {status === 'failed' && (
                <div className="rounded-2xl bg-white py-12 text-center shadow-sm">
                    <p className="text-red-500">Erro ao carregar as metas.</p>
                </div>
            )}

            {status !== 'loading' && goals.length === 0 && (
                <div className="rounded-2xl bg-white py-12 text-center shadow-sm">
                    <p className="mb-3 text-gray-400">Nenhuma meta cadastrada.</p>
                    <Link to="/goals/new" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline">
                        <FiPlus /> Criar primeira meta
                    </Link>
                </div>
            )}

            {goals.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            )}
        </div>
    );
}

function GoalCard({ goal }: { goal: Goal }) {
    const progress = useSelector(selectGoalProgress(goal.id));
    const reached = progress >= 100;

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${reached ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        <FiTarget size={16} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{goal.name}</p>
                        <p className="text-xs text-gray-400">
                            {goal.categoryName ? `${goal.categoryName} · ` : ''}até {formatDate(goal.deadline)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-500">{formatCurrency(goal.targetAmount)}</span>
                <span className={`font-semibold ${reached ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {progress.toFixed(0)}%
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${reached ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            {reached && (
                <p className="mt-2 text-xs font-medium text-emerald-600">Meta atingida!</p>
            )}
        </div>
    );
}
