/// <reference types="vite/client" />

// ไปแก้เป็น interface
declare module 'js-cookie' {
  const Cookies;
  export default Cookies;
}

type currentUser = {
  id: string;
  username: string;
};

type User = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
};

type ModalVisibilityProps = {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
};

type Props = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

type RegisterFormData = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: 'male' | 'female' | 'other' | '';
  age: number | null;
};

type LoginFormData = {
  username: string;
  password: string;
};
