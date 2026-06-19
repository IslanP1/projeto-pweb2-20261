import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiDollarSign } from "react-icons/fi";
import type { AppDispatch } from "../../app/store";
import { register } from "../../features/auth/authThunks";
import { selectAuthStatus, selectAuthError } from "../../features/auth/authSelectors";

const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const status = useSelector(selectAuthStatus);
    const error = useSelector(selectAuthError);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const isLoading = status === "loading";

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        const result = await dispatch(register({ name, username, password }));
        if (register.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg"
            >
                <div className="flex flex-col items-center gap-2 mb-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600">
                        <FiDollarSign className="text-2xl text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Criar Conta</h1>
                    <p className="text-sm text-gray-500">Comece a controlar suas finanças</p>
                </div>

                <div>
                    <label htmlFor="name" className={labelClass}>Nome Completo</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="username" className={labelClass}>Usuário</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Escolha um nome de usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Senha</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Crie uma senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg transition hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Já tem conta?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                        Entrar
                    </Link>
                </p>
            </form>
        </div>
    );
}
