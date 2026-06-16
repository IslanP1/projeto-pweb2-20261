import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { login } from "../../features/auth/authThunks";
import {
  selectAuthStatus,
  selectAuthError,
} from "../../features/auth/authSelectors";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const isLoading = status === "loading";

  let buttonText = "Entrar";
  if (isLoading) {
    buttonText = "Entrando...";
  }

  let errorMessage = null;
  if (error) {
    errorMessage = <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
        className="
            flex
            flex-col
            gap-4
            w-full
            max-w-md
            mx-auto
            p-8
            bg-white
            rounded-2xl
            shadow-lg
        "
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>

        <input
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
                focus:border-transparent
            "
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
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
                focus:border-transparent
            "
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

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
          Não tem conta?{" "}
          <Link
            to="/register"
            className="font-semibold text-green-600 hover:text-green-700 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
