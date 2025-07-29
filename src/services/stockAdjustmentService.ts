import type { StockPayload } from '../interfaces/services.interface';
import apiCaller from './apiCaller';

export const adjustStock = async (data: StockPayload) => {
  const response = await apiCaller.post('/stock-adjustment', data);
  return response.data.data;
};

export const getStockAdjustHistories = async (productId?: string) => {
  const params: Record<string, string> = {
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };
  if (productId) params.productId = productId;

  const response = await apiCaller.get('/stock-adjustment', { params });
  return response.data.data;
};
