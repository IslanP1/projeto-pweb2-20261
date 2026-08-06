import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import type { AppDispatch } from '../../app/store';
import { fetchSpendingLimits, createSpendingLimit, deleteSpendingLimit } from '../../features/spendingLimit/spendingLimitThunks';
import { fetchDashboardTransactions } from '../../features/transaction/transactionThunk';
import {
    selectSpendingLimits,
    selectSpendingLimitError,
    selectSpendingLimitStatus,
    selectSpendingStatus,
} from '../../features/spendingLimit/spendingLimitSelectors';
import { selectCategories, selectDashboardStatus } from '../../features/transaction/transactionSelectors';

const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function barColor(percentUsed: number) {
    if (percentUsed >= 100) return 'bg-red-500';
    if (percentUsed >= 80) return 'bg-amber-400';
    return 'bg-emerald-500';
}

function textColor(percentUsed: number) {
    if (percentUsed >= 100) return 'text-red-600';
    if (percentUsed >= 80) return 'text-amber-600';
    return 'text-emerald-700';
}

export default function SpendingLimits() {
    const dispatch = useDispatch<AppDispatch>();

    const categories = useSelector(selectCategories);
    const limits = useSelector(selectSpendingLimits);
    const status = useSelector(selectSpendingLimitStatus);
    const error = useSelector(selectSpendingLimitError);
    const spendingStatus = useSelector(selectSpendingStatus);
    const dashboardStatus = useSelector(selectDashboardStatus);

    const [categoryId, setCategoryId] = useState('1');
    const [limitAmount, setLimitAmount] = useState('');

    useEffect(() => {
        dispatch(fetchSpendingLimits());
        if (dashboardStatus === 'idle') {
            dispatch(fetchDashboardTransactions());
        }
    }, [dispatch, dashboardStatus]);

    const isLoading = status === 'loading';

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        await dispatch(createSpendingLimit({
            categoryId: parseInt(categoryId),
            limitAmount: parseFloat(limitAmount),
        }));
        setLimitAmount('');
    };

    return (
        <div className="space-y-6 pb-6">
            <h1 className="text-2xl font-bold text-gray-800">Limites de Gastos</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div>
                    <label className={labelClass}>Categoria</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={inputClass}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="limitAmount" className={labelClass}>Valor-limite (mensal)</label>
                    <input
                        id="limitAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                        value={limitAmount}
                        onChange={(e) => setLimitAmount(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    <FiPlus /> Definir limite
                </button>

                {error && (
                    <p className="text-sm text-red-500 sm:col-span-3">{error}</p>
                )}
            </form>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Progresso do mês</h2>

                {limits.length === 0 ? (
                    <p className="py-6 text-center text-gray-400">Nenhum limite cadastrado.</p>
                ) : (
                    <ul className="space-y-5">
                        {limits.map((limit) => {
                            const s = spendingStatus.find((item) => item.categoryId === limit.categoryId);
                            const spent = s?.spent ?? 0;
                            const percentUsed = s?.percentUsed ?? 0;
                            return (
                                <li key={limit.id}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">{limit.categoryName}</span>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-semibold ${textColor(percentUsed)}`}>
                                                {formatCurrency(spent)} / {formatCurrency(limit.limitAmount)}
                                            </span>
                                            <button
                                                onClick={() => dispatch(deleteSpendingLimit(limit.id))}
                                                className="text-gray-400 transition hover:text-red-500"
                                                aria-label={`Remover limite de ${limit.categoryName}`}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${barColor(percentUsed)}`}
                                            style={{ width: `${Math.min(100, percentUsed)}%` }}
                                        />
                                    </div>
                                    <p className={`mt-0.5 text-right text-xs ${textColor(percentUsed)}`}>
                                        {percentUsed.toFixed(0)}% do limite
                                        {percentUsed >= 100 ? ' · limite ultrapassado' : percentUsed >= 80 ? ' · próximo do limite' : ''}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
