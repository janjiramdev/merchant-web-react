/// <reference types="vite/client" />

declare module 'js-cookie' {
  const Cookies;
  export default Cookies;
}

type TUserGender = 'male' | 'female' | 'other';

type TAdjustType = 'add' | 'remove';
