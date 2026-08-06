import { useEffect, useState } from 'react';
import './CotacoesWidget.css';

const QUOTES_URL = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL';

interface QuoteRaw {
    code: string;
    name: string;
    bid: string;
    pctChange: string;
    create_date: string;
}

type QuotesResponse = Record<string, QuoteRaw>;

interface Quote {
    code: string;
    name: string;
    bid: number;
    pctChange: number;
    updatedAt: string;
}

const CURRENCY_KEYS: Record<string, string> = {
    USD: 'USDBRL',
    EUR: 'EURBRL',
    BTC: 'BTCBRL',
};

function formatBRL(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CotacoesWidget() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [amount, setAmount] = useState('100');
    const [currency, setCurrency] = useState<'USD' | 'EUR' | 'BTC'>('USD');

    const loadQuotes = () => {
        setStatus('loading');
        fetch(QUOTES_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Falha ao consultar cotações');
                return res.json() as Promise<QuotesResponse>;
            })
            .then((data) => {
                const parsed = Object.values(data).map((q) => ({
                    code: q.code,
                    name: q.name,
                    bid: parseFloat(q.bid),
                    pctChange: parseFloat(q.pctChange),
                    updatedAt: q.create_date,
                }));
                setQuotes(parsed);
                setStatus('succeeded');
            })
            .catch(() => setStatus('failed'));
    };

    useEffect(() => {
        loadQuotes();
    }, []);

    const selected = quotes.find((q) => q.code === currency);
    const converted = selected ? parseFloat(amount || '0') * selected.bid : null;

    return (
        <div className="mfe-cotacoes-card">
            <div className="mfe-cotacoes-header">
                <h2>Cotações</h2>
                <button
                    type="button"
                    className="mfe-cotacoes-refresh"
                    onClick={loadQuotes}
                    disabled={status === 'loading'}
                    aria-label="Atualizar cotações"
                >
                    {status === 'loading' ? '...' : '↻'}
                </button>
            </div>

            {status === 'failed' && (
                <p className="mfe-cotacoes-error">Não foi possível carregar as cotações agora.</p>
            )}

            {status !== 'failed' && (
                <ul className="mfe-cotacoes-list">
                    {(status === 'loading' && quotes.length === 0 ? Object.keys(CURRENCY_KEYS) : quotes.map((q) => q.code)).map((code) => {
                        const quote = quotes.find((q) => q.code === code);
                        const up = (quote?.pctChange ?? 0) >= 0;
                        return (
                            <li key={code} className="mfe-cotacoes-item">
                                <span className="mfe-cotacoes-code">{code}/BRL</span>
                                <span className="mfe-cotacoes-value">
                                    {quote ? formatBRL(quote.bid) : '—'}
                                </span>
                                {quote && (
                                    <span className={`mfe-cotacoes-change ${up ? 'up' : 'down'}`}>
                                        {up ? '▲' : '▼'} {Math.abs(quote.pctChange).toFixed(2)}%
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="mfe-cotacoes-converter">
                <label htmlFor="mfe-amount">Converter</label>
                <div className="mfe-cotacoes-converter-row">
                    <input
                        id="mfe-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <select value={currency} onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'BTC')}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="BTC">BTC</option>
                    </select>
                </div>
                <p className="mfe-cotacoes-converted">
                    {converted !== null ? `= ${formatBRL(converted)}` : 'Cotação indisponível'}
                </p>
            </div>

            <p className="mfe-cotacoes-footer">Fonte: AwesomeAPI · microfrontend independente</p>
        </div>
    );
}
