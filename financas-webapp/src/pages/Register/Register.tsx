import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../app/store';
import { register } from '../../features/auth/authThunks';
import {
    selectAuthStatus,
    selectAuthError,
} from '../../features/auth/authSelectors';

export default function Register() {
    // useDispatch permite enviar actions/thunks para o Redux
    const dispatch = useDispatch<AppDispatch>();

    // useNavigate permite redirecionar o usuário para outra rota
    const navigate = useNavigate();

    // useSelector lê valores do estado global do Redux
    // status: 'idle' | 'loading' | 'succeeded' | 'failed'
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);

    // useState cria estado local do componente
    // [valor, função para atualizar o valor]
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        // O evento onSubmit no <form> é acionado pelo botão type="submit"
        // ou ao pressionar Enter em qualquer campo.
        // O TypeScript infere o tipo do evento pelo contexto do onSubmit,
        // então não precisamos anotar o tipo de (e) manualmente.
        <form onSubmit={async (e) => {
            // Impede o comportamento padrão do form (recarregar a página)
            e.preventDefault();

            // dispatch envia o thunk register para o Redux
            // O thunk faz a requisição HTTP e atualiza o estado automaticamente
            const result = await dispatch(register({ name, username, password }));

            // register.fulfilled significa que o cadastro foi bem-sucedido
            if (register.fulfilled.match(result)) {
                navigate('/login');
            }
        }}>
            <h2>Criar conta</h2>

            <div>
                <label htmlFor="name">Nome</label>
                {/*
                    value + onChange = "controlled input"
                    O React controla o valor do campo via estado (name)
                    onChange atualiza o estado a cada tecla digitada
                */}
                <input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Senha</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {/* Renderização condicional: só exibe o erro se ele existir */}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

            {/*
                disabled durante o loading evita cliques duplos
                status === 'loading' é true enquanto o thunk está em execução
            */}
            <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            <p>
                Já tem conta? <a href="/login">Entrar</a>
            </p>
        </form>
    );
}
