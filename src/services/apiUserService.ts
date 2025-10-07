import type { User } from '../types/auth';
import api from './axiosConfig';


export const apiUserService = {

  async getUserInfo(): Promise<User>{
    const response = await api.get('/api/user')
    return response.data
  },

  async createUser(data: { username: string; password: string; name: string; lastname: string }) {
    try {
      const response = await api.post('/admin/create-user', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  }
};