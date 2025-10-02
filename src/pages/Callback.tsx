import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code');

      console.log({searchParams})

      if (!code) {
        navigate('/login');
        return;
      }

      try {
        const tokens = await authService.exchangeCodeForToken(code);
        authService.saveTokens(tokens);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to exchange code', error);
        navigate('/login');
      }
    }

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
}