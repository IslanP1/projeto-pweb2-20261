import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import TransactionList from "./pages/Transactions/TransactionList";
import CreateTransaction from "./pages/Transactions/CreateTransaction";
import Relatorio from "./pages/Relatorio/Relatorio";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/Menu/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/new" element={<CreateTransaction />} />
          <Route path="/relatorio" element={<Relatorio />} />
        </Route>
      </Route>
    </Routes>
  );
}
