import type { IStockAdjust, IProduct, ISale } from './features.interface';

export interface ILoginServiceRequestBody {
  username: string;
  password: string;
}

export interface ILoginServiceResponseData {
  accessToken: string;
  refreshToken: string;
}
export interface IProductResponseData extends IProduct {
  createdAt: string;
  createdBy: string;
}

export interface ICreateProductRequestBody {
  name: string;
  description?: string;
  price: number;
}

export interface IUpdateProductRequestBody {
  name?: string;
  description?: string;
  price?: number;
}

export interface ISaleHistoriesResponseData extends ISale {
  createdAt: string;
  createdBy: string;
}

export interface ISaleRequestBody {
  productId: string;
  quantity: number;
}

export interface IStockAdjustHistoriesResponseData extends IStockAdjust {
  createdAt: string;
  createdBy: string;
}

export interface IAdjustStockRequestBody {
  productId: string;
  adjustType: TAdjustType;
  quantity: number;
}

export interface ICreateUserRequestBody {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: TUserGender;
  age: number;
}

export interface IUpdateUserRequestBody {
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: TUserGender;
  age?: number;
}
