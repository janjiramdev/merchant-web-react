import { createContext, useContext } from 'react';
import type { LoginResponse } from '../interfaces/services.interface';

type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: currentUser | null;
  setTokens: (input: LoginResponse) => void;
  removeTokens: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
