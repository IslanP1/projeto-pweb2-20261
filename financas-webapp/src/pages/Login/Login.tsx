import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { login } from '../../features/auth/authThunks';
import {
    selectAuthStatus,
    selectAuthError,
    selectUser,
} from '../../features/auth/authSelectors';

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);
    const user = useSelector(selectUser);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        dispatch(login({ username, password }));
    };

    return (
        <div>
            <input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading' ? 'Entrando...' : 'Entrar'}
            </button>

            <p>status: {status}</p>
            {error && <p style={{ color: 'red' }}>erro: {error}</p>}
            {user && <p style={{ color: 'green' }}>logado: {user.name}</p>}
        </div>
    );
}