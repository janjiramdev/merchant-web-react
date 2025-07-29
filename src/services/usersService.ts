import type { CreateUserPayload } from '../interfaces/services.interface';
import apiCaller from './apiCaller';

type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'username'>> & {
  password?: string;
};

export const createUser = async (data: CreateUserPayload) => {
  const response = await apiCaller.post('/users', data);
  return response.data.data;
};

export const updateUser = async (
  objectID: string,
  updateData: UpdateUserPayload,
) => {
  const response = await apiCaller.patch(`/users/${objectID}`, updateData);
  return response.data.data;
};

export const getUser = async (username: string) => {
  const response = await apiCaller.get('/users', {
    params: {
      username,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    },
  });
  return response.data.data;
};
