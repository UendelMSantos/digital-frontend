import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = authService.getAccessToken();

    if (!token) {
      throw new Error('No access token');
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // Endpoints específicos
  async getUserInfo() {
    return this.fetchWithAuth('/user');
  },

  async getBalance(username: string) {
    return this.fetchWithAuth(`/account/balance?username=${username}`);
  },
};