import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import type { AppDispatch } from '../../app/store';
import { fetchTransactions } from '../../features/transaction/transactionThunk';
import {
    selectTransactions,
    selectTransactionStatus,
    selectCurrentPage,
    selectTotalPages,
} from '../../features/transaction/transactionSelectors';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

export default function TransactionList() {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector(selectTransactions);
    const status = useSelector(selectTransactionStatus);
    const currentPage = useSelector(selectCurrentPage);
    const totalPages = useSelector(selectTotalPages);

    useEffect(() => {
        dispatch(fetchTransactions(0));
    }, [dispatch]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
                <Link
                    to="/transactions/new"
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    <FiPlus /> Nova transação
                </Link>
            </div>

            <div className="rounded-2xl bg-white shadow-sm">
                {status === 'loading' && (
                    <div className="py-12 text-center">
                        <p className="text-gray-400">Carregando...</p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="py-12 text-center">
                        <p className="text-red-500">Erro ao carregar as transações.</p>
                    </div>
                )}

                {status === 'succeeded' && transactions.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-gray-400">Nenhuma transação encontrada.</p>
                    </div>
                )}

                {status === 'succeeded' && transactions.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                        {transactions.map((t) => {
                            const isIncome = t.type === 'INCOME';
                            return (
                                <li key={t.id} className="flex items-center gap-4 px-6 py-4">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                        {isIncome ? <FiTrendingUp size={18} /> : <FiTrendingDown size={18} />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-800">{t.categoryName}</p>
                                        <p className="truncate text-xs text-gray-400">
                                            {t.description ? `${t.description} · ` : ''}{formatDate(t.date)}
                                            {t.tag ? ` · #${t.tag}` : ''}
                                        </p>
                                    </div>

                                    <span className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {isIncome ? '+' : '−'}{formatCurrency(t.amount)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => dispatch(fetchTransactions(currentPage - 1))}
                        disabled={currentPage === 0}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => dispatch(fetchTransactions(currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
