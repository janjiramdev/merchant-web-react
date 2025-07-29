import { Navigate, Route, Routes } from 'react-router-dom';
import ExternalRoute from './ExternalRoute';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import MainLayout from '../layouts/MainLayout';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import Register from '../pages/Register';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ExternalRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
