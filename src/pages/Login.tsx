import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
            <hr className="my-4 border-t border-gray-200" />
            <p className="text-sm text-gray-600 mt-4 text-center">
              Ainda não possui uma conta?{" "}
              <Link 
                to="/register" 
                className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

        </div>
      );

}