import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../app/store';
import { create } from '../../features/transaction/transactionThunk';
import { selectCategories, selectTransactionStatus, selectTransactionError } from '../../features/transaction/transactionSelectors';
import type { TransactionType } from '../../features/transaction/transactionService';

const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function CreateTransaction() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const categories = useSelector(selectCategories);
    const status = useSelector(selectTransactionStatus);
    const error = useSelector(selectTransactionError);

    const today = new Date().toISOString().split('T')[0];
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [categoryId, setCategoryId] = useState('1');
    const [date, setDate] = useState(today);
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');

    const isLoading = status === 'loading';

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const result = await dispatch(create({
            amount: parseFloat(amount),
            type,
            categoryId: parseInt(categoryId),
            date,
            description: description || undefined,
            tag: tag || undefined,
        }));
        if (create.fulfilled.match(result)) {
            navigate('/transactions');
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
