import type { AxiosError } from 'axios';
import type {
  LoginPayload,
  LoginResponse,
  LoginResponseWrapper,
} from '../interfaces/services.interface';
import apiCaller from './apiCaller';

export const login = async (formData: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiCaller.post<LoginResponseWrapper>(
      '/auth/login',
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || 'login failed');
  }
};
