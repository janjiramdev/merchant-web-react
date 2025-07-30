import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../contexts/sessions/SessionContext';

export default function InternalRoute() {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
