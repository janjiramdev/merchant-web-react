import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
} from '../utils/cookie';
import { decodeJwt } from '../utils/jwt';
import { refreshTokenService } from './authService';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: boolean;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_ENDPOINT,
  timeout: 60000,
  withCredentials: true,
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = 'application/json';
    const accessToken = getAccessToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

client.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError & { config?: CustomAxiosRequestConfig }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.retry
    ) {
      const refreshToken = getRefreshToken();
      const refreshDecoded = refreshToken ? decodeJwt(refreshToken) : undefined;
      const isRefreshTokenValid =
        refreshDecoded?.exp && refreshDecoded.exp * 1000 > Date.now();

      if (isRefreshTokenValid && refreshToken) {
        try {
          const response = await refreshTokenService(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response;

          setAccessToken(accessToken);
          setRefreshToken(newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (err) {
          removeAccessToken();
          removeRefreshToken();
          window.location.href = '/login';

          return Promise.reject(
            err instanceof Error ? err.message : JSON.stringify(err),
          );
        }
      } else {
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/login';

        return Promise.reject(error.response?.data ?? error);
      }
    }

    return Promise.reject(error.response?.data ?? error);
  },
);

export default client;
