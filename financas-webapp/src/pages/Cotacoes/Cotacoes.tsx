import { lazy } from 'react';
import RemoteBoundary from '../../components/RemoteBoundary';

const CotacoesWidget = lazy(() => import('financas_mfe_cotacoes/CotacoesWidget'));

export default function Cotacoes() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Cotações</h1>
                <p className="text-gray-500">
                    Módulo carregado em tempo de execução a partir de um microfrontend independente (RF07).
                </p>
            </div>

            <RemoteBoundary fallbackTitle="Módulo de cotações indisponível">
                <CotacoesWidget />
            </RemoteBoundary>
        </div>
    );
}
