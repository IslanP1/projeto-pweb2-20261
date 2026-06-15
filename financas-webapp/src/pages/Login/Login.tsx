import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../app/store';
import { login } from '../../features/auth/authThunks';
import {
    selectAuthStatus,
    selectAuthError,
} from '../../features/auth/authSelectors';

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        const result = await dispatch(login({ username, password }));
        if (login.fulfilled.match(result)) {
            navigate('/');
        }
    };

    const isLoading = status === 'loading';

    let buttonText = 'Entrar';
    if (isLoading) {
        buttonText = 'Entrando...';
    }

    let errorMessage = null;
    if (error) {
        errorMessage = <p style={{ color: 'red' }}>erro: {error}</p>;
    }

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
        }}>
            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={isLoading}>
                {buttonText}
            </button>

            {errorMessage}
        </form>
    );
}