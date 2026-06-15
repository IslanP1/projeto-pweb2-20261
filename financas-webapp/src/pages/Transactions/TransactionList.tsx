import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchTransactions } from '../../features/transaction/transactionThunk';

export default function TransactionList() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const transactions = useSelector((state: RootState) => state.transactions.transactions);
    const status = useSelector((state: RootState) => state.transactions.status);
    const currentPage = useSelector((state: RootState) => state.transactions.currentPage);
    const totalPages = useSelector((state: RootState) => state.transactions.totalPages);

    // useEffect executa após o componente ser montado na tela
    // [] como segundo argumento = executa só uma vez (na montagem)
    useEffect(() => {
        dispatch(fetchTransactions(0));
    }, [dispatch]);

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            dispatch(fetchTransactions(currentPage - 1));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch(fetchTransactions(currentPage + 1));
        }
    };

    let content = null;

    if (status === 'loading') {
        content = <p>Carregando...</p>;
    }

    if (status === 'failed') {
        content = <p style={{ color: 'red' }}>Erro ao carregar transações.</p>;
    }

    if (status === 'succeeded') {
        if (transactions.length === 0) {
            content = <p>Nenhuma transação encontrada.</p>;
        } else {
            content = (
                <ul>
                    {transactions.map((t) => {
                        const tipo = t.type === 'INCOME' ? 'Receita' : 'Despesa';
                        const valor = `R$ ${t.amount.toFixed(2)}`;

                        return (
                            <li key={t.id}>
                                <strong>{tipo}</strong>
                                {' — '}
                                {valor}
                                {' | '}{t.categoryName}
                                {' | '}{t.date}
                                {t.description && <span> | {t.description}</span>}
                            </li>
                        );
                    })}
                </ul>
            );
        }
    }

    return (
        <div>
            <h2>Transações</h2>

            <button onClick={() => navigate('/transactions/new')}>
                Nova transação
            </button>

            {content}

            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                    Anterior
                </button>
                <span> Página {currentPage + 1} de {totalPages || 1} </span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                    Próxima
                </button>
            </div>
        </div>
    );
}
