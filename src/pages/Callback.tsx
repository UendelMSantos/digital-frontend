import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth(); 

  useEffect(() => {
    async function handleCallback() {
      
      const code = searchParams.get('code');

      if (!code) {
        console.error('No code in URL, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const tokens = await authService.exchangeCodeForToken(code);
        
        authService.saveTokens(tokens);
        
        await refreshUser();
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to exchange code:', error);
        navigate('/login');
      }
    }

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
}