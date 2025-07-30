import axios, { AxiosError } from 'axios';
import mainConfig from '../configs/main.config';
import type {
  ILoginServiceRequestBody,
  ILoginServiceResponseData,
} from '../interfaces/services.interface';
import client from './client.service';

export const login = async (
  body: ILoginServiceRequestBody,
): Promise<ILoginServiceResponseData> => {
  try {
    const response = await client.post<ILoginServiceResponseData>(
      '/auth/login',
      body,
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message ?? JSON.stringify(err));
  }
};

export const refreshToken = async (
  token: string,
): Promise<ILoginServiceResponseData> => {
  try {
    const response = await axios.get<{ data: ILoginServiceResponseData }>(
      `${mainConfig.services.endpoint}/auth/refresh-token`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError)
      return Promise.reject(error.response?.data ?? error);
    return Promise.reject(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
  }
};
