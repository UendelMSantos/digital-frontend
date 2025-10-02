import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login(){
    const {login, isAuthenticated } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if(isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center">Digital Wallet</h1>
            <button
              onClick={login}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login com OAuth2
            </button>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Você será redirecionado para fazer login de forma segura
            </p>
          </div>
        </div>
      );

}