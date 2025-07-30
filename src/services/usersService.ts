import type {
  ICreateUserData,
  IUpdateUserData,
} from '../interfaces/services.interface';
import client from './client';

export const getUser = async (username: string) => {
  try {
    const response = await client.get('/users', {
      params: {
        username,
        sortBy: 'createdAt',
        sortDirection: 'asc',
      },
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const createUser = async (data: ICreateUserData) => {
  try {
    const response = await client.post('/users', data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const updateUser = async (id: string, data: IUpdateUserData) => {
  try {
    const response = await client.patch(`/users/${id}`, data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};
