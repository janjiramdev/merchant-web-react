import type { ProductPayload } from '../interfaces/services.interface';
import apiCaller from './apiCaller';

export const searchProducts = async (name?: string) => {
  const params = new URLSearchParams();
  if (name !== undefined && name !== 'undefined' && name !== '') {
    params.append('name', name);
  }
  params.append('sortBy', 'name');
  params.append('sortDirection', 'asc');

  const response = await apiCaller.get('/products', { params });
  return response.data.data;
};

export const createProduct = async (data: ProductPayload) => {
  const response = await apiCaller.post('/products', data);
  return response.data.data;
};

export const updateProduct = async (id: string, data: ProductPayload) => {
  const response = await apiCaller.patch(`/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string) => {
  const response = await apiCaller.delete(`/products/${id}`);
  return response.data.data;
};
