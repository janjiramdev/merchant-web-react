import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type {
  ISessionTokens,
  ISessionUser,
} from '../../interfaces/contexts.interface';
import { refreshTokenService } from '../../services/authService';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeAccessToken,
  removeRefreshToken,
} from '../../utils/cookie';
import { decodeJwt } from '../../utils/jwt';
import { SessionContext } from './SessionContext';

export default function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasNavigatedToLoginRef = useRef(false);

  const [sessionAccessToken, setSessionAccessToken] = useState<
    string | undefined
  >(() => getAccessToken() ?? undefined);
  const [sessionRefreshToken, setSessionRefreshToken] = useState<
    string | undefined
  >(() => getRefreshToken() ?? undefined);
  const [sessionUser, setSessionUser] = useState<ISessionUser | undefined>(
    undefined,
  );

  const isAuthenticated = !!sessionAccessToken;

  const removeTokens = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
    setSessionAccessToken(undefined);
    setSessionRefreshToken(undefined);
    setSessionUser(undefined);
  }, []);

  const setTokens = useCallback(
    (input: ISessionTokens) => {
      const { accessToken, refreshToken } = input;
      const decodedAccessToken = decodeJwt(accessToken);

      if (decodedAccessToken) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setSessionAccessToken(accessToken);
        setSessionRefreshToken(refreshToken);
        setSessionUser({
          id: decodedAccessToken.sub,
          username: decodedAccessToken.username,
        });
      } else removeTokens();
    },
    [removeTokens],
  );

  const refreshTokens = useCallback(
    async (input: string) => {
      try {
        const response = await refreshTokenService(input);
        setTokens(response);
      } catch {
        removeTokens();
        navigate('/login');
      }
    },
    [setTokens, removeTokens, navigate],
  );

  useEffect(() => {
    const accessDecoded = sessionAccessToken
      ? decodeJwt(sessionAccessToken)
      : undefined;
    const refreshDecoded = sessionRefreshToken
      ? decodeJwt(sessionRefreshToken)
      : undefined;

    const now = Date.now();
    const isAccessTokenValid =
      accessDecoded?.exp && accessDecoded.exp * 1000 > now;
    const isRefreshTokenValid =
      refreshDecoded?.exp && refreshDecoded.exp * 1000 > now;

    if (accessDecoded && isAccessTokenValid) {
      setSessionUser({
        id: accessDecoded.sub,
        username: accessDecoded.username,
      });
    } else if (
      !isAccessTokenValid &&
      sessionRefreshToken &&
      refreshDecoded &&
      isRefreshTokenValid
    ) {
      refreshTokens(sessionRefreshToken);
    } else {
      removeTokens();

      if (
        location.pathname !== '/register' &&
        !hasNavigatedToLoginRef.current
      ) {
        hasNavigatedToLoginRef.current = true;
        navigate('/login');
      }
    }
  }, [
    sessionAccessToken,
    sessionRefreshToken,
    refreshTokens,
    removeTokens,
    navigate,
    location,
  ]);

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        sessionUser,
        setTokens,
        removeTokens,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
