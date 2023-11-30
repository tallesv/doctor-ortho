import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes';
import { AuthProvider } from './hooks/auth';
import { parseCookies } from 'nookies';

function App() {
  const cookies = parseCookies();
  const token = cookies['doctor-ortho.token'];

  return (
    <BrowserRouter>
      <AuthProvider token={token}>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
