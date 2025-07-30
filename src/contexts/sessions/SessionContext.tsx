import { createContext, useContext } from 'react';
import type {
  ISessionTokens,
  ISessionUser,
} from '../../interfaces/contexts.interface';

interface ISessionContextType {
  isAuthenticated: boolean;
  sessionUser: ISessionUser | undefined;
  setTokens: (input: ISessionTokens) => void;
  removeTokens: () => void;
}

export const SessionContext = createContext<ISessionContextType | undefined>(
  undefined,
);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('Session context not found');
  return context;
};
