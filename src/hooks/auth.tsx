import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { parseCookies } from 'nookies';
import { useUsersQuery } from '@/shared/api/Users/useUsersQuery';
import {
  useLoginMutation,
  useLogoutMutation,
} from '@/shared/api/Users/useUsersMutations';

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
  const [refreshToken, setRefreshToken] = useState(token);
  const [isLogged, setIsLogged] = useState(!!token);
  const [user, setUser] = useState<UserProps>({} as UserProps);

  const cookies = parseCookies();
  const { data: userData, refetch } = useUsersQuery();

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const login = useCallback(
    async (data: LoginProps) => {
      await loginMutation.mutateAsync(data);
      setRefreshToken(cookies['doctor-ortho.token']);
      setIsLogged(true);
      await refetch();
    },
    [loginMutation, cookies, refetch],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setIsLogged(false);
    setRefreshToken(undefined);
    setUser({} as UserProps);
    document.body.classList.remove('dark');
  }, [logoutMutation]);

  useEffect(() => {
    const token = cookies['doctor-ortho.token'];
    if (token) {
      setRefreshToken(token);
      setIsLogged(true);
    }
  }, [cookies]);

  return (
    <AuthContext.Provider
      value={{
        refreshToken,
        login,
        logout,
        setUser,
        isLogged,
        user: userData || user,
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
