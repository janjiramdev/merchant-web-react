import { jwtDecode } from 'jwt-decode';

interface IJwtPayload {
  exp: number;
  username: string;
  iat: number;
  sub: string;
}

export const decodeJwt = (input: string): IJwtPayload | undefined => {
  try {
    return jwtDecode<IJwtPayload>(input);
  } catch {
    return undefined;
  }
};
