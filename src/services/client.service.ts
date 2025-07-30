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
} from '../utils/cookie.util';
import { decodeJwt } from '../utils/jwt.util';
import { refreshToken as refreshTokenService } from './auth.service';
import mainConfig from '../configs/main.config';

interface CustomAxiosRequest extends InternalAxiosRequestConfig {
  retry?: boolean;
}

const client = axios.create({
  baseURL: mainConfig.services.endpoint,
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
  (error: AxiosError) => Promise.reject(error.response?.data ?? error),
);

client.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError & { config?: CustomAxiosRequest }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.retry
    ) {
      const refreshToken = getRefreshToken();
      const decodedRefreshToken = refreshToken
        ? decodeJwt(refreshToken)
        : undefined;
      const isRefreshTokenValid =
        decodedRefreshToken?.exp && decodedRefreshToken.exp * 1000 > Date.now();

      if (refreshToken && isRefreshTokenValid) {
        try {
          const response = await refreshTokenService(refreshToken);
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response;

          setAccessToken(newAccessToken);
          setRefreshToken(newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return client(originalRequest);
        } catch (err) {
          removeAccessToken();
          removeRefreshToken();
          window.location.href = '/login';

          if (err instanceof AxiosError)
            return Promise.reject(error.response?.data ?? error);
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
