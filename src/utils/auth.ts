import { parseExpireTime } from './parseExpireTime';
import Cookies from 'js-cookie';

export const getAccessToken = (): string | null => {
  return Cookies.get('accessToken');
};

export const getRefreshToken = (): string | null => {
  return Cookies.get('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  const expireAccessToken =
    import.meta.env.VITE_COOKIES_ACCESSTOKEN_EXPIRE || '3m';
  const expiresAccessToken = parseExpireTime(expireAccessToken);

  const expireRefreshToken =
    import.meta.env.VITE_COOKIES_ACCESSTOKEN_EXPIRE || '5m';
  const expiresRefreshToken = parseExpireTime(expireRefreshToken);

  Cookies.set('accessToken', accessToken, { expires: expiresAccessToken });
  Cookies.set('refreshToken', refreshToken, { expires: expiresRefreshToken });
};

export const removeTokens = (): void => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};
