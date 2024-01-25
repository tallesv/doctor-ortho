import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes';
import { AuthProvider } from './hooks/auth';
import { parseCookies } from 'nookies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const cookies = parseCookies();
  const token = cookies['doctor-ortho.token'];

  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <AuthProvider token={token}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
