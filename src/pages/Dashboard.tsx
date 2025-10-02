import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function loadBalance() {
      if (user) {
        try {
          const data = await apiService.getBalance(user.username);
          setBalance(data.balance);
        } catch (error) {
          console.error('Failed to load balance', error);
        }
      }
    }

    loadBalance();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Digital Wallet</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Bem-vindo, {user.name} {user.lastname}
          </h2>
          <p className="text-gray-600">Username: {user.username}</p>
          <p className="text-gray-600">Roles: {user.authorities.join(', ')}</p>
          
          {balance !== null && (
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-lg">Saldo atual:</p>
              <p className="text-3xl font-bold text-blue-600">R$ {balance}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}