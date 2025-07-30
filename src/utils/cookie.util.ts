import Cookies from 'js-cookie';
import mainConfig from '../configs/main.config';

const formatExpiredTime = (str: string): Date => {
  const now = new Date();
  const match = str.match(/^(\d+)([smhd])$/);

  if (!match) {
    now.setHours(now.getHours() + 1);
    return now;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      now.setSeconds(now.getSeconds() + value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + value);
      break;
    case 'h':
      now.setHours(now.getHours() + value);
      break;
    case 'd':
      now.setDate(now.getDate() + value);
      break;
  }
  return now;
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get('refreshToken');
};

export const setAccessToken = (input: string) => {
  Cookies.set('accessToken', input, {
    expires: formatExpiredTime(
      mainConfig.cookies.accessTokenExpireTime ?? '1h',
    ),
  });
};

export const setRefreshToken = (input: string) => {
  Cookies.set('refreshToken', input, {
    expires: formatExpiredTime(
      mainConfig.cookies.refreshTokenExpireTime ?? '7d',
    ),
  });
};

export const removeAccessToken = () => {
  Cookies.remove('accessToken');
};

export const removeRefreshToken = () => {
  Cookies.remove('refreshToken');
};
