import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { create } from '../../features/transaction/transactionThunk';
import type { TransactionType } from '../../features/transaction/transactionService';

export default function CreateTransaction() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const categories = useSelector((state: RootState) => state.transactions.categories);
    const status = useSelector((state: RootState) => state.transactions.status);
    const error = useSelector((state: RootState) => state.transactions.error);

    // Data padrão: hoje no formato YYYY-MM-DD (exigido pelo input type="date")
    const today = new Date().toISOString().split('T')[0];

    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [categoryId, setCategoryId] = useState('1');
    const [date, setDate] = useState(today);
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');

    const isLoading = status === 'loading';

    let errorMessage = null;
    if (error) {
        errorMessage = <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    return (
        <form onSubmit={async (e) => {
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
        }}>
            <h2>Nova Transação</h2>

            <div>
                <label htmlFor="type">Tipo</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                >
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                </select>
            </div>

            <div>
                <label htmlFor="amount">Valor</label>
                <input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="category">Categoria</label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="date">Data</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Descrição (opcional)</label>
                <input
                    id="description"
                    type="text"
                    placeholder="Descrição da transação"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="tag">Tag (opcional)</label>
                <input
                    id="tag"
                    type="text"
                    placeholder="Ex: mercado, fixo..."
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
            </div>

            {errorMessage}

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
            </button>

            <button type="button" onClick={() => navigate('/transactions')}>
                Cancelar
            </button>
        </form>
    );
}
