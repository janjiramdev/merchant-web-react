import type {
  ISaleHistoriesResponseData,
  ISaleRequestBody,
} from '../interfaces/services.interface';
import client from './client.service';

export const getSaleHistories = async () => {
  try {
    const response = await client.get<ISaleHistoriesResponseData[]>('/sales', {
      params: {
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
    });
    return response.data.map((res: ISaleHistoriesResponseData) => {
      return { ...res, productId: res.product._id };
    });
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const sale = async (body: ISaleRequestBody) => {
  try {
    const response = await client.post<ISaleHistoriesResponseData>(
      '/sales',
      body,
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
