import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { apiAccountService } from '../services/apiAccountService';
import type { Transaction } from '../types/auth';
import { TransactionDialog } from '../components/TransactionDialog';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBalance() {
      if (user) {
        try {
          const value = await apiAccountService.getBalance(user.username);
          setBalance(value);

          const transactionsValues = await apiAccountService.getTransactions(user.username, startDate, endDate);
          setTransactions(transactionsValues);
        } catch (error) {
          console.error('Failed to load balance', error);
        }
      }
    }

    loadTransactions
    loadBalance();
  }, [user]);

  async function loadTransactions() {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiAccountService.getTransactions(
        user.username,
        startDate || '',
        endDate || ''
      );
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao buscar transações', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">Digital Wallet</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <div className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Bem-vindo, {user.name} {user.lastname}
          </h2>

          {balance !== null && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <p className="text-lg">Saldo atual:</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {balance.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Filtro de Transações
            </h3>
            <TransactionDialog
              username={user.username}
              onSuccess={loadTransactions}
            />
            {/* <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
              onClick={handleOpen}
            >
              Nova Transação
            </button> */}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Data inicial
              </label>
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Data final
              </label>
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              onClick={loadTransactions}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* LISTA DE TRANSAÇÕES */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Suas Transações
          </h3>

          {loading ? (
            <p className="text-gray-500">Carregando transações...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500">Nenhuma transação encontrada.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-3">Data</th>
                  <th className="p-3">De</th>
                  <th className="p-3">Para</th>
                  <th className="p-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      {new Date(t.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">{t.senderName}</td>
                    <td className="p-3">{t.receiverName}</td>
                    <td
                      className={`p-3 text-right font-semibold ${
                        t.senderUsername === user.username
                          ? 'text-red-500'
                          : 'text-green-600'
                      }`}
                    >
                      {t.senderUsername === user.username ? '-' : '+'} R${' '}
                      {t.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
