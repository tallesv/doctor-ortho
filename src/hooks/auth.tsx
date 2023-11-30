import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  //user: User;
  //setUser: (data: User) => void;
  refreshToken: string | undefined;
  login: (data: LoginProps) => Promise<void>;
  logout: () => void;
  isLogged: boolean;
}

interface LoginProps {
  email: string;
  password: string;
}

interface AuthContext {
  token?: string;
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ token, children }: AuthContext) {
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = useState(token);
  const [isLogged, setIsLogged] = useState(!!token);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['doctor-ortho.token'];
    //const userFromLocalStorage = cookies['doctor-ortho.user'];

    if (token) {
      //setUser(JSON.parse(userFromLocalStorage));
      setRefreshToken(token);
      setIsLogged(true);
      //api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  const login = useCallback(async ({ email, password }: LoginProps) => {
    try {
      const signInResponse = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );

      const token = await signInResponse.user.getIdTokenResult();
      const userFirebaseId = signInResponse.user.uid;
      setCookie(undefined, 'doctor-ortho.token', token.token, {
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      });
      setCookie(undefined, 'doctor-ortho.user-firebase-id', userFirebaseId, {
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      });

      setIsLogged(true);
      setRefreshToken(token.token);
      //api.defaults.headers.common.Authorization = `Bearer ${token}`;
      navigate('/');
    } catch (err) {
      throw err;
      //message.error('Credenciais invalidas!');
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth).then(() => {
      destroyCookie(undefined, 'doctor-ortho.token');
      destroyCookie(undefined, 'doctor-ortho.user-firebase-id');
      setIsLogged(false);
      setRefreshToken(undefined);
      //setUser({} as User);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        refreshToken,
        login,
        logout,
        isLogged,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider!');
  }

  return context;
}

export { AuthProvider, useAuth };
