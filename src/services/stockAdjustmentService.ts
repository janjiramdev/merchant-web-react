import type {
  IAdjustStockData,
  IStockAdjustHistoriesResponse,
} from '../interfaces/services.interface';
import client from './client';

export const getStockAdjustHistories = async () => {
  try {
    const response = await client.get('/stock-adjustment', {
      params: {
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
    });
    return response.data.map((res: IStockAdjustHistoriesResponse) => {
      return { ...res, productId: res.product._id };
    });
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const adjustStock = async (data: IAdjustStockData) => {
  try {
    const response = await client.post('/stock-adjustment', data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};
