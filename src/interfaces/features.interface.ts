export interface IUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: TUserGender;
  age: number;
}

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  currentStock: number;
  price: number;
  totalSales: number;
}

export interface IAdjustStock {
  _id: string;
  productId: string;
  adjustType: TAdjustType;
  quantity: number;
}

export interface ISale {
  _id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
}

export interface IAddModalProps {
  isOpen: boolean;
  close: () => void;
}
