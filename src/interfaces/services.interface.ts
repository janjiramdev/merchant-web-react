export interface LoginPayload {
  username: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface LoginResponseWrapper {
  status: string;
  data: LoginResponse;
}
export interface CreateUserPayload {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}
export interface ProductPayload {
  name?: string;
  description?: string;
  price?: number;
}
export interface StockPayload {
  productId: string;
  quantity: number;
  adjustType: 'add' | 'remove';
}
export interface SalePayload {
  productId: string;
  quantity: number;
}
