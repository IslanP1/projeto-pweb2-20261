import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiBarChart2,
    FiDollarSign,
    FiHome,
    FiLogOut,
    FiMenu,
    FiPlusCircle,
    FiX,
} from "react-icons/fi";

import { selectUser } from "../../features/auth/authSelectors";
import { logout } from "../../features/auth/authSlice";

const menu = [
    { name: "Dashboard", path: "/", icon: FiHome },
    { name: "Transações", path: "/transactions", icon: FiDollarSign },
    { name: "Nova Transação", path: "/transactions/new", icon: FiPlusCircle },
    { name: "Relatórios", path: "/relatorio", icon: FiBarChart2 },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
        setOpen(false);
        navigate("/login", { replace: true });
    };

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-50 bg-emerald-800 shadow-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                            <FiDollarSign className="text-xl text-emerald-700" />
                        </div>
                        <p className="text-xs text-emerald-100">Controle Financeiro</p>
                    </div>

                    <nav className="hidden items-center gap-8 md:flex">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 text-sm transition ${
                                            isActive
                                                ? "font-semibold text-white"
                                                : "text-emerald-100 hover:text-white"
                                        }`
                                    }
                                >
                                    <Icon />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="group hidden items-center gap-2 rounded border-b-2 border-transparent px-2 py-2 text-white/80 transition duration-300 hover:border-white hover:text-white/100 cursor-pointer md:flex"
                    >
                        <FiLogOut />
                        Sair
                    </button>

                    <button
                        onClick={() => setOpen(true)}
                        className="text-white md:hidden"
                        aria-label="Abrir menu"
                    >
                        <FiMenu size={28} />
                    </button>
                </div>
            </header>

            <MobileMenu
                open={open}
                onClose={() => setOpen(false)}
                onLogout={handleLogout}
                userName={user?.name ?? user?.username ?? "Usuário"}
            />
        </>
    );
}

function MobileMenu({
    open,
    onClose,
    onLogout,
    userName,
}: {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
    userName: string;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose}>
            <aside
                className="ml-auto flex h-full w-72 flex-col bg-emerald-900 px-6 py-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-emerald-200">Olá,</p>
                        <h2 className="font-semibold text-white">{userName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-white transition hover:bg-white/10"
                        aria-label="Fechar menu"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-3">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                                        isActive
                                            ? "bg-white font-semibold text-emerald-900"
                                            : "text-emerald-100 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <Icon />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Botão Sair: tom verde, fundo transparente ao hover */}
                <button
                    onClick={onLogout}
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-700 px-4 py-3 text-emerald-300 transition hover:bg-white/10 hover:text-emerald-100"
                >
                    <FiLogOut />
                    Sair
                </button>
            </aside>
        </div>
    );
}
