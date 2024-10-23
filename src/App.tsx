import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes';
import { AuthProvider } from './hooks/auth';
import { parseCookies } from 'nookies';
import { queryClient } from './config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const cookies = parseCookies();
  const token = cookies['doctor-ortho.token'];
  const theme =
    cookies['doctor-ortho.theme'] === 'white'
      ? 'light'
      : cookies['doctor-ortho.theme'];

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider token={token}>
          <Router />
          <ToastContainer theme={theme} />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
