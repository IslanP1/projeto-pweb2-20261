import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { AppDispatch } from '../../app/store';
import { fetchDashboardTransactions } from '../../features/transaction/transactionThunk';
import {
    selectDashboardStatus,
    selectMonthlyData,
} from '../../features/transaction/transactionSelectors';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

interface TooltipEntry {
    name: string;
    value: number;
    color: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
            <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
                    {entry.name}: {formatCurrency(entry.value ?? 0)}
                </p>
            ))}
        </div>
    );
}

export default function Relatorio() {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector(selectDashboardStatus);
    const monthlyData = useSelector(selectMonthlyData);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDashboardTransactions());
        }
    }, [dispatch, status]);

    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
    const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
    const totalBalance = totalIncome - totalExpense;

    if (status === 'idle' || status === 'loading') {
        return (
            <div className="flex justify-center py-20">
                <p className="text-gray-400">Carregando...</p>
            </div>
        );
    }

    if (monthlyData.length === 0) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
                <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                    <p className="text-gray-400">Nenhuma transação encontrada para gerar relatórios.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
                <p className="text-gray-500">
                    {monthlyData.length === 1
                        ? 'Dados de 1 mês'
                        : `Dados de ${monthlyData.length} meses`}
                </p>
            </div>

            {/* Cards de totais do período */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SummaryCard label="Receitas no Período" value={totalIncome} color="text-green-700" bg="bg-green-50" />
                <SummaryCard label="Despesas no Período" value={totalExpense} color="text-red-600" bg="bg-red-50" />
                <SummaryCard
                    label="Saldo do Período"
                    value={totalBalance}
                    color={totalBalance >= 0 ? 'text-emerald-700' : 'text-red-600'}
                    bg={totalBalance >= 0 ? 'bg-emerald-50' : 'bg-red-50'}
                />
            </div>

            {/* Gráfico de barras mensal */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold text-gray-800">
                    Receitas vs Despesas por Mês
                </h2>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                        data={monthlyData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        barCategoryGap="30%"
                        barGap={4}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(v: number) =>
                                v >= 1000
                                    ? `R$${(v / 1000).toFixed(0)}k`
                                    : `R$${v.toFixed(0)}`
                            }
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={false}
                            tickLine={false}
                            width={60}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                        <Legend
                            wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
                            formatter={(value) =>
                                value === 'income' ? 'Receitas' : 'Despesas'
                            }
                        />
                        <Bar
                            dataKey="income"
                            name="income"
                            fill="#059669"
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            dataKey="expense"
                            name="expense"
                            fill="#ef4444"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabela mensal */}
            <div className="rounded-2xl bg-white shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Detalhes por Mês</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                    {[...monthlyData].reverse().map((m) => {
                        const balance = m.income - m.expense;
                        return (
                            <li key={m.month} className="flex items-center gap-4 px-6 py-4">
                                <div className="w-16 shrink-0">
                                    <span className="text-sm font-semibold text-gray-700">{m.label}</span>
                                </div>
                                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-1 text-sm">
                                    <span className="text-green-700">
                                        ↑ {formatCurrency(m.income)}
                                    </span>
                                    <span className="text-red-500">
                                        ↓ {formatCurrency(m.expense)}
                                    </span>
                                </div>
                                <span className={`text-sm font-semibold ${balance >= 0 ? 'text-emerald-700' : 'text-red-500'}`}>
                                    {balance >= 0 ? '+' : '−'}{formatCurrency(Math.abs(balance))}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

function SummaryCard({
    label,
    value,
    color,
    bg,
}: {
    label: string;
    value: number;
    color: string;
    bg: string;
}) {
    return (
        <div className={`rounded-2xl p-5 shadow-sm ${bg}`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`mt-1 text-xl font-bold ${color}`}>
                {formatCurrency(value)}
            </p>
        </div>
    );
}
