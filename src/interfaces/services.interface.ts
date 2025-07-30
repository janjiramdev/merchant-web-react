import type { IAdjustStock, IProduct, ISale } from './features.interface';

export interface ILoginServiceData {
  username: string;
  password: string;
}

export interface ILoginServiceResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ICreateUserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: TUserGender;
  age: number;
}

export interface IUpdateUserData {
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: TUserGender;
  age?: number;
}

export interface ICreateProductData {
  name: string;
  description?: string;
  price: number;
}

export interface IUpdateProductData {
  name?: string;
  description?: string;
  price?: number;
}

export interface ISearchProductResponse extends IProduct {
  createdAt: string;
  createdBy: string;
}

export interface IAdjustStockData {
  productId: string;
  adjustType: TAdjustType;
  quantity: number;
}

export interface IStockAdjustHistoriesResponse extends IAdjustStock {
  product: ISearchProductResponse;
  createdAt: string;
  createdBy: string;
}

export interface ISaleData {
  productId: string;
  quantity: number;
}

export interface ISaleHistoriesResponse extends ISale {
  product: ISearchProductResponse;
  createdAt: string;
  createdBy: string;
}
