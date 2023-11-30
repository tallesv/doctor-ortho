import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  isPrivate: boolean;
  children: ReactNode;
}

export const ProtectedRoute = ({
  isPrivate,
  children,
}: ProtectedRouteProps) => {
  const { isLogged } = useAuth();
  if (!isLogged && isPrivate) {
    return <Navigate to="/login" replace />;
  }

  if (isLogged && !isPrivate) {
    return <Navigate to="/" replace />;
  }

  return children;
};
