import { Outlet } from 'react-router-dom';
import NavBar from '../features/NavBar';

export default function MainLayout() {
  return (
    <div>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
