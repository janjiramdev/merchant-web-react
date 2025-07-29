import { AuthContext } from './AuthContext';
import { parseJwt } from '../utils/jwt';
import { useState, useEffect } from 'react';
import type { LoginResponse } from '../interfaces/services.interface';
import type { JwtPayload } from '../interfaces/utils.interface';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { parseExpireTime } from '../utils/parseExpireTime';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    () => Cookies.get('accessToken') || null,
  );
  const [user, setUser] = useState<currentUser | null>(null);

  const setTokens = (input: LoginResponse) => {
    const { accessToken: inputAccessToken, refreshToken: inputRefreshToken } =
      input;

    if (inputAccessToken) {
      Cookies.set('accessToken', inputAccessToken, {
        expires: parseExpireTime(
          import.meta.env.VITE_COOKIES_ACCESSTOKEN_EXPIRE || '3m',
        ),
      });
      setAccessTokenState(inputAccessToken);

      const decodedAccessToken = parseJwt(inputAccessToken) as JwtPayload;
      setUser({
        id: decodedAccessToken?.sub ?? '',
        username: decodedAccessToken?.username ?? '',
      });
    } else {
      Cookies.remove('accessToken');
      setAccessTokenState(null);
      setUser(null);
    }

    if (inputRefreshToken) {
      Cookies.set('refreshToken', inputRefreshToken, {
        expires: parseExpireTime(
          import.meta.env.VITE_COOKIES_REFRESHTOKEN_EXPIRE || '5m',
        ),
      });
    } else Cookies.remove('refreshToken');
  };

  const removeTokens = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setAccessTokenState(null);
  };

  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (accessToken) {
      const payload = parseJwt(accessToken) as JwtPayload;
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();

      if (isExpired) removeTokens();
      else
        setUser({
          id: payload?.sub ?? '',
          username: payload?.username ?? '',
        });
    } else {
      setUser(null);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        setTokens,
        removeTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
