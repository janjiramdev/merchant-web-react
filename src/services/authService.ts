import axios from 'axios';
import type {
  ILoginServiceData,
  ILoginServiceResponse,
} from '../interfaces/services.interface';
import client from './client';

export const login = async (
  data: ILoginServiceData,
): Promise<ILoginServiceResponse> => {
  try {
    const response = await client.post('/auth/login', data);
    return response.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};

export const refreshTokenService = async (
  input: string,
): Promise<ILoginServiceResponse> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_ENDPOINT}/auth/refresh-token`,
      { headers: { Authorization: `Bearer ${input}` } },
    );
    return response.data.data;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(error.message ?? JSON.stringify(err));
  }
};
