export interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  username?: string;
  [key: string]: unknown;
}
