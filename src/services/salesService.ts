import type { SalePayload } from '../interfaces/services.interface';
import apiCaller from './apiCaller';

export const sale = async (data: SalePayload) => {
  const response = await apiCaller.post('/sales', data);
  return response.data.data;
};

export const getSaleHistories = async (productId?: string) => {
  const params = new URLSearchParams();
  if (productId) params.append('productId', productId);
  params.append('sortBy', 'createdAt');
  params.append('sortDirection', 'desc');
  const response = await apiCaller.get('/sales', {
    params,
  });
  return response.data.data;
};
