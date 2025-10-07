import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUserService } from '../services/apiUserService';

export function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = { username, password, name, lastname };
      await apiUserService.createUser(data);

      setMessage('✅ Usuário criado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setMessage(`❌ ${error.message || 'Erro ao criar usuário.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Criar Conta
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Preencha os campos abaixo para se cadastrar
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              placeholder="Digite seu CPF"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                placeholder="Jane"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sobrenome
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-lg text-white font-semibold shadow-md transition duration-300 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-gray-500 mt-6 text-sm">
          Já tem uma conta?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-semibold">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
