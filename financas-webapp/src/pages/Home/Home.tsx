import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPlus } from 'react-icons/fi';
import type { AppDispatch } from '../../app/store';
import { fetchDashboardTransactions } from '../../features/transaction/transactionThunk';
import {
    selectDashboardStatus,
    selectCurrentMonthIncome,
    selectCurrentMonthExpense,
    selectCurrentMonthBalance,
    selectRecentTransactions,
    selectExpensesByCategory,
} from '../../features/transaction/transactionSelectors';
import { selectUser } from '../../features/auth/authSelectors';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const status = useSelector(selectDashboardStatus);
    const income = useSelector(selectCurrentMonthIncome);
    const expense = useSelector(selectCurrentMonthExpense);
    const balance = useSelector(selectCurrentMonthBalance);
    const recent = useSelector(selectRecentTransactions);
    const expensesByCategory = useSelector(selectExpensesByCategory);

    useEffect(() => {
        dispatch(fetchDashboardTransactions());
    }, [dispatch]);

    const currentMonth = capitalize(
        new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
    );

    if (status === 'idle' || status === 'loading') {
        return (
            <div className="flex justify-center py-20">
                <p className="text-gray-400">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Olá, {user?.name ?? 'Usuário'}!
                </h1>
                <p className="text-gray-500">{currentMonth}</p>
            </div>

            {/* Cards de resumo do mês */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard
                    label="Saldo do Mês"
                    value={balance}
                    icon={<FiDollarSign size={18} />}
                    iconClass={balance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}
                    valueClass={balance >= 0 ? 'text-emerald-700' : 'text-red-600'}
                />
                <MetricCard
                    label="Receitas"
                    value={income}
                    icon={<FiTrendingUp size={18} />}
                    iconClass="bg-green-100 text-green-700"
                    valueClass="text-green-700"
                />
                <MetricCard
                    label="Despesas"
                    value={expense}
                    icon={<FiTrendingDown size={18} />}
                    iconClass="bg-red-100 text-red-600"
                    valueClass="text-red-600"
                />
            </div>

            {/* Últimas transações */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Últimas Transações</h2>
                    <Link to="/transactions" className="text-sm text-emerald-600 hover:underline">
                        Ver todas
                    </Link>
                </div>

                {recent.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="mb-3 text-gray-400">Nenhuma transação registrada.</p>
                        <Link
                            to="/transactions/new"
                            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline"
                        >
                            <FiPlus /> Criar primeira transação
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {recent.map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{t.categoryName}</p>
                                    <p className="text-xs text-gray-400">
                                        {t.description ?? formatDate(t.date)}
                                    </p>
                                </div>
                                <span className={`text-sm font-semibold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(t.amount)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* RF04 — Gastos por categoria */}
            {expensesByCategory.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Gastos por Categoria</h2>
                    <ul className="space-y-4">
                        {expensesByCategory.map((cat) => {
                            const pct = expense > 0 ? (cat.total / expense) * 100 : 0;
                            return (
                                <li key={cat.name}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="text-gray-700">{cat.name}</span>
                                        <span className="font-semibold text-gray-800">
                                            {formatCurrency(cat.total)}
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-red-400 transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="mt-0.5 text-right text-xs text-gray-400">
                                        {pct.toFixed(0)}% das despesas
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* FAB para nova transação (mobile) */}
            <Link
                to="/transactions/new"
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700 md:hidden"
                aria-label="Nova transação"
            >
                <FiPlus size={24} />
            </Link>
        </div>
    );
}

function MetricCard({
    label,
    value,
    icon,
    iconClass,
    valueClass,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconClass: string;
    valueClass: string;
}) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-xl p-2 ${iconClass}`}>
                {icon}
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-xl font-bold ${valueClass}`}>
                {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
    );
}
