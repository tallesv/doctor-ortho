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
import { api } from '../client/api';

interface AuthContextData {
  user: UserProps;
  refreshToken: string | undefined;
  login: (data: LoginProps) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserProps>>;
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
  const [user, setUser] = useState<UserProps>({} as UserProps);

  const cookies = parseCookies();

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
      setRefreshToken(token.token);
      setIsLogged(true);
      navigate('/');
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth).then(() => {
      destroyCookie(undefined, 'doctor-ortho.token');
      destroyCookie(undefined, 'doctor-ortho.user-firebase-id');
      setIsLogged(false);
      setRefreshToken(undefined);
      setUser({} as UserProps);
    });
  }, []);

  useEffect(() => {
    const token = cookies['doctor-ortho.token'];
    const firebaseId = cookies['doctor-ortho.user-firebase-id'];

    if (token) {
      setRefreshToken(token);
      setIsLogged(true);
    }

    if (firebaseId && !user.name) {
      api.get(`/users/${firebaseId}`).then(response => setUser(response.data));
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        refreshToken,
        login,
        logout,
        setUser,
        isLogged,
        user,
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
