import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { apiUserService } from '../services/apiUserService';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userInfo = await apiUserService.getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to load user', error);
        authService.logout();
        setUser(null);
      }
    }
  };

  useEffect(() => {
    async function loadUser() {
      await refreshUser();
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const login = () => {
    authService.login();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: authService.isAuthenticated(),
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}