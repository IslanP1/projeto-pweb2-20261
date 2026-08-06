import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import type { AppDispatch, RootState } from '../../app/store';
import { create } from '../../features/transaction/transactionThunk';
import { selectCategories, selectTransactionStatus, selectTransactionError, selectDashboardStatus } from '../../features/transaction/transactionSelectors';
import { fetchDashboardTransactions } from '../../features/transaction/transactionThunk';
import type { TransactionType } from '../../features/transaction/transactionService';
import { fetchSpendingLimits } from '../../features/spendingLimit/spendingLimitThunks';
import { selectSpendingStatus, selectSpendingStatusForCategory } from '../../features/spendingLimit/spendingLimitSelectors';
import { notifyViaServiceWorker } from '../../services/notifications';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function CreateTransaction() {
    const dispatch = useDispatch<AppDispatch>();
    const store = useStore<RootState>();
    const navigate = useNavigate();

    const categories = useSelector(selectCategories);
    const status = useSelector(selectTransactionStatus);
    const error = useSelector(selectTransactionError);
    const dashboardStatus = useSelector(selectDashboardStatus);

    const today = new Date().toISOString().split('T')[0];
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [categoryId, setCategoryId] = useState('1');
    const [date, setDate] = useState(today);
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');

    const isLoading = status === 'loading';

    const limitStatus = useSelector(
        selectSpendingStatusForCategory(type === 'EXPENSE' ? parseInt(categoryId) : null)
    );
    const limitReached = !!limitStatus && limitStatus.percentUsed >= 100;

    useEffect(() => {
        dispatch(fetchSpendingLimits());
        if (dashboardStatus === 'idle') {
            dispatch(fetchDashboardTransactions());
        }
    }, [dispatch, dashboardStatus]);

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        const parsedCategoryId = parseInt(categoryId);

        const result = await dispatch(create({
            amount: parsedAmount,
            type,
            categoryId: parsedCategoryId,
            date,
            description: description || undefined,
            tag: tag || undefined,
        }));

        if (create.fulfilled.match(result)) {
            if (type === 'EXPENSE') {
                // Refetch instead of trusting the limits/transactions loaded on mount: those
                // requests may still be in flight if the user submits quickly, which would
                // silently skip the notification below.
                notifyIfLimitReached(parsedCategoryId);
            }
            navigate('/transactions');
        }
    };

    const notifyIfLimitReached = async (categoryId: number) => {
        await Promise.all([
            dispatch(fetchSpendingLimits()),
            dispatch(fetchDashboardTransactions()),
        ]);

        const current = selectSpendingStatus(store.getState()).find((s) => s.categoryId === categoryId);
        if (current && current.percentUsed >= 80) {
            notifyViaServiceWorker({
                title: 'Limite de gastos',
                body: `Você já usou ${current.percentUsed.toFixed(0)}% do limite de ${current.categoryName} este mês (${formatCurrency(current.spent)} de ${formatCurrency(current.limitAmount)}).`,
                tag: `spending-limit-${categoryId}`,
            });
        }
    };

    return (
        <div className="mx-auto max-w-lg">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Nova Transação</h1>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
                <div>
                    <label className={labelClass}>Tipo</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as TransactionType)}
                        className={inputClass}
                    >
                        <option value="EXPENSE">Despesa</option>
                        <option value="INCOME">Receita</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className={labelClass}>Valor</label>
                    <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

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
                    <label htmlFor="date" className={labelClass}>Data</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="description" className={labelClass}>
                        Descrição <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                        id="description"
                        type="text"
                        placeholder="Descrição da transação"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="tag" className={labelClass}>
                        Tag <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                        id="tag"
                        type="text"
                        placeholder="Ex: mercado, fixo..."
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className={inputClass}
                    />
                </div>

                {limitReached && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        <FiAlertTriangle className="mt-0.5 shrink-0" />
                        <span>
                            Você já atingiu o limite mensal de {limitStatus?.categoryName} ({formatCurrency(limitStatus?.spent ?? 0)} de {formatCurrency(limitStatus?.limitAmount ?? 0)}).
                        </span>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/transactions')}
                        className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
