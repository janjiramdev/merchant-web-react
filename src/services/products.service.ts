import type {
  ICreateProductRequestBody,
  IProductResponseData,
  IUpdateProductRequestBody,
} from '../interfaces/services.interface';
import client from './client.service';

export const searchProducts = async () => {
  try {
    const response = await client.get<IProductResponseData[]>('/products', {
      params: {
        sortBy: 'name',
        sortDirection: 'asc',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const createProduct = async (body: ICreateProductRequestBody) => {
  try {
    const response = await client.post<IProductResponseData>('/products', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const updateProduct = async (
  id: string,
  body: IUpdateProductRequestBody,
) => {
  try {
    const response = await client.patch<IProductResponseData>(
      `/products/${id}`,
      body,
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await client.delete<IProductResponseData>(
      `/products/${id}`,
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
