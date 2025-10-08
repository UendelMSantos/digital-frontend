import type { Transaction } from '../types/auth';
import api from './axiosConfig';


export const apiAccountService = {

  async getBalance(username: string): Promise<number | null>{
    const response = await api.get('/api/account/balance',{
        params: {username},
    })
    return response.data
  },

  async getTransactions(username: string, startDate: string, endDate: string): Promise<Transaction[]>{
    const response = await api.get('/api/transaction', {
        params: {
            username,
            startDate,
            endDate
        },
    })
    return response.data
  },

  async createTransaction(data: {senderUsername: string, receiverUsername: string, value: number}){
    try {
      const response = await api.post('/api/transaction/new-transaction', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  }

};