import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ExternalRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
}
