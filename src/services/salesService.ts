import type {
  ISaleData,
  ISaleHistoriesResponse,
} from '../interfaces/services.interface';
import client from './client';

export const getSaleHistories = async () => {
  try {
    const response = await client.get('/sales', {
      params: {
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
    });
    return response.data.map((res: ISaleHistoriesResponse) => {
      return { ...res, productId: res.product._id };
    });
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const sale = async (data: ISaleData) => {
  try {
    const response = await client.post('/sales', data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};
