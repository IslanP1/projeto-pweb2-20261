import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface Props {
    children: ReactNode;
    fallbackTitle: string;
}

interface State {
    hasError: boolean;
}

class RemoteErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <RemoteUnavailable title={this.props.fallbackTitle} />;
        }
        return this.props.children;
    }
}

function RemoteUnavailable({ title }: { title: string }) {
    return (
        <div className="flex max-w-md flex-col items-center gap-2 rounded-2xl bg-amber-50 p-6 text-center text-amber-800">
            <FiAlertTriangle size={20} />
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-amber-700">
                Não foi possível carregar este microfrontend. Verifique se o servidor de
                desenvolvimento dele está em execução (porta 5174).
            </p>
        </div>
    );
}

export default function RemoteBoundary({ children, fallbackTitle }: Props) {
    return (
        <RemoteErrorBoundary fallbackTitle={fallbackTitle}>
            <Suspense
                fallback={
                    <div className="flex max-w-md items-center justify-center rounded-2xl bg-white p-10 shadow-sm">
                        <p className="text-gray-400">Carregando microfrontend...</p>
                    </div>
                }
            >
                {children}
            </Suspense>
        </RemoteErrorBoundary>
    );
}
