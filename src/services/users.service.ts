import type { IUser } from '../interfaces/features.interface';
import type {
  ICreateUserRequestBody,
  IUpdateUserRequestBody,
} from '../interfaces/services.interface';
import client from './client.service';

export const getUser = async (username: string) => {
  try {
    const response = await client.get<IUser>('/users', {
      params: {
        username,
        sortBy: 'createdAt',
        sortDirection: 'asc',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const createUser = async (body: ICreateUserRequestBody) => {
  try {
    const response = await client.post<IUser>('/users', body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const updateUser = async (id: string, body: IUpdateUserRequestBody) => {
  try {
    const response = await client.patch<IUser>(`/users/${id}`, body);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};
