import Cookies from 'js-cookie';

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
      import.meta.env.VITE_COOKIE_ACCESS_TOKEN_EXPIRE_TIME ?? '1h',
    ),
  });
};

export const setRefreshToken = (input: string) => {
  Cookies.set('refreshToken', input, {
    expires: formatExpiredTime(
      import.meta.env.VITE_COOKIE_REFRESH_TOKEN_EXPIRE_TIME ?? '7d',
    ),
  });
};

export const removeAccessToken = () => {
  Cookies.remove('accessToken');
};

export const removeRefreshToken = () => {
  Cookies.remove('refreshToken');
};
