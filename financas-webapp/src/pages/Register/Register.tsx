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

    const navigate = useNavigate();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isLoading = status === 'loading';

    let buttonText = 'Cadastrar';
    if (isLoading) {
        buttonText = 'Cadastrando...';
    }

    let errorMessage = null;
    if (error) {
        errorMessage = <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            const result = await dispatch(register({ name, username, password }));
            if (register.fulfilled.match(result)) {
                navigate('/login');
            }
        }}>
            <h2>Criar conta</h2>

            <div>
                <label htmlFor="name">Nome</label>
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

            {errorMessage}

            <button type="submit" disabled={isLoading}>
                {buttonText}
            </button>

            <p>
                Já tem conta? <a href="/login">Entrar</a>
            </p>
        </form>
    );
}
