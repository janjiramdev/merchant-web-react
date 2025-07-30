import type {
  ICreateProductData,
  IUpdateProductData,
} from '../interfaces/services.interface';
import client from './client';

export const searchProducts = async () => {
  try {
    const response = await client.get('/products', {
      params: {
        sortBy: 'name',
        sortDirection: 'asc',
      },
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const createProduct = async (data: ICreateProductData) => {
  try {
    const response = await client.post('/products', data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const updateProduct = async (id: string, data: IUpdateProductData) => {
  try {
    const response = await client.patch(`/products/${id}`, data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await client.delete(`/products/${id}`);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};
