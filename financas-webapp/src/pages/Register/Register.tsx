import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { register } from "../../features/auth/authThunks";
import {
  selectAuthStatus,
  selectAuthError,
} from "../../features/auth/authSelectors";

export default function Register() {
  // useDispatch permite enviar actions/thunks para o Redux
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = status === "loading";

  let buttonText = "Cadastrar";
  if (isLoading) {
    buttonText = "Cadastrando...";
  }

  let errorMessage = null;
  if (error) {
    errorMessage = <p style={{ color: "red" }}>Erro: {error}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const result = await dispatch(
            register({
              name,
              username,
              password,
            }),
          );

          if (register.fulfilled.match(result)) {
            navigate("/login");
          }
        }}
        className="
                w-full
                max-w-md
                bg-white
                rounded-2xl
                shadow-lg
                p-8
                flex
                flex-col
                gap-4
            "
      >
        <div className="flex justify-center">
          <div
            className="
                        h-16
                        w-16
                        rounded-full
                        border-4
                        border-green-600
                        flex
                        items-center
                        justify-center
                        text-2xl
                    "
          >
            💰
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center">Criar Conta</h2>

        <p className="text-center text-gray-500 mb-2">
          Cadastre-se para começar a controlar suas finanças
        </p>

        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Nome Completo
          </label>

          <input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-500
                    "
          />
        </div>

        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Usuário
          </label>

          <input
            id="username"
            type="text"
            placeholder="Seu nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-500
                    "
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Senha
          </label>

          <input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-500
                    "
          />
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center">Erro: {errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="
                    w-full
                    py-3
                    bg-green-600
                    text-white
                    font-semibold
                    rounded-lg
                    transition
                    hover:bg-green-700
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                "
        >
          {buttonText}
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem conta?
          <a
            href="/login"
            className="
                        ml-1
                        text-green-600
                        font-semibold
                        hover:underline
                    "
          >
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}
