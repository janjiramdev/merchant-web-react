import { jwtDecode } from 'jwt-decode';

interface IJwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

export const decodeJwt = (input: string): IJwtPayload | undefined => {
  try {
    return jwtDecode<IJwtPayload>(input);
  } catch {
    return undefined;
  }
};
