import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes';
import { AuthProvider } from './hooks/auth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
