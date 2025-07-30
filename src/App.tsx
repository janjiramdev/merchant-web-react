import { BrowserRouter } from 'react-router-dom';
import SessionProvider from './contexts/sessions/SessionProvider';
import AppRoute from './routes/AppRoute';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoute />
      </SessionProvider>
    </BrowserRouter>
  );
}
