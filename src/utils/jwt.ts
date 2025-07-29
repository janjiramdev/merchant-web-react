import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '../interfaces/utils.interface';

export const parseJwt = (token?: string | null): JwtPayload | null => {
  if (!token || typeof token !== 'string') {
    console.error('token is missing or not a string');
    return null;
  }

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (e) {
    console.error('invalid token', e);
    return null;
  }
};
