import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../app/store';
import { createGoal } from '../../features/goal/goalThunks';
import { selectGoalError, selectGoalStatus } from '../../features/goal/goalSelectors';
import { selectCategories } from '../../features/transaction/transactionSelectors';

const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function GoalForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const categories = useSelector(selectCategories);
    const status = useSelector(selectGoalStatus);
    const error = useSelector(selectGoalError);

    const today = new Date().toISOString().split('T')[0];
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const isLoading = status === 'loading';

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const result = await dispatch(createGoal({
            name,
            targetAmount: parseFloat(targetAmount),
            deadline,
            startDate: today,
            categoryId: categoryId ? parseInt(categoryId) : undefined,
        }));
        if (createGoal.fulfilled.match(result)) {
            navigate('/goals');
        }
    };

    return (
        <div className="mx-auto max-w-lg">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Nova Meta</h1>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
                <div>
                    <label htmlFor="name" className={labelClass}>Nome da meta</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Ex: Viagem, Reserva de emergência..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="targetAmount" className={labelClass}>Valor-alvo</label>
                    <input
                        id="targetAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="deadline" className={labelClass}>Data-limite</label>
                    <input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="category" className={labelClass}>
                        Categoria <span className="font-normal text-gray-400">(opcional)</span>
                    </label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Nenhuma</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/goals')}
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
