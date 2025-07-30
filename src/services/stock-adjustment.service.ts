import type {
  IAdjustStockRequestBody,
  IStockAdjustHistoriesResponseData,
} from '../interfaces/services.interface';
import client from './client.service';

export const getStockAdjustHistories = async () => {
  try {
    const response = await client.get<IStockAdjustHistoriesResponseData[]>(
      '/stock-adjustment',
      {
        params: {
          sortBy: 'createdAt',
          sortDirection: 'desc',
        },
      },
    );
    return response.data.map((res: IStockAdjustHistoriesResponseData) => {
      return { ...res, productId: res.product._id };
    });
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const adjustStock = async (body: IAdjustStockRequestBody) => {
  try {
    const response = await client.post('/stock-adjustment', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
