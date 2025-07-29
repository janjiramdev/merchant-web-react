import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from '../utils/auth';

const apiCaller = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_ENDPOINT,
  timeout: 10000,
  withCredentials: true,
});

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

apiCaller.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = config.headers as AxiosRequestHeaders;
    headers['Content-Type'] = 'application/json';
    const token = getAccessToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshedToken = false;
let refreshTokenQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processRefreshToken = (error: unknown, token: string | null = null) => {
  refreshTokenQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token!);
  });
  refreshTokenQueue = [];
};

apiCaller.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: CustomAxiosRequestConfig }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshedToken)
        return new Promise((resolve, reject) => {
          refreshTokenQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(apiCaller(originalRequest));
            },
            reject,
          });
        });

      originalRequest._retry = true;
      isRefreshedToken = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          console.warn('no refresh token found');
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(new Error('no refresh token'));
        }

        const response = await axios.post(
          `${import.meta.env.VITE_SERVICE_ENDPOINT}/auth/refresh-token`,
          { refreshToken },
        );
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshTokenFromAPI,
        } = response.data;

        const newRefreshToken = newRefreshTokenFromAPI ?? refreshToken;
        setTokens(newAccessToken, newRefreshToken);

        apiCaller.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;
        processRefreshToken(null, newAccessToken);

        const headers = originalRequest.headers as AxiosRequestHeaders;
        headers['Authorization'] = `Bearer ${newAccessToken}`;

        if (originalRequest && originalRequest.headers) {
          const headers = originalRequest.headers as AxiosRequestHeaders;
          headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return apiCaller(originalRequest);
      } catch (err) {
        processRefreshToken(err, null);
        removeTokens();
        return Promise.reject(err);
      } finally {
        isRefreshedToken = false;
      }
    }

    const status = error.response?.status;
    const message = error.response?.data || error.message;
    return Promise.reject({ status, message });
  },
);

export default apiCaller;
