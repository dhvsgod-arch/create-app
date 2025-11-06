import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({ children, redirectPath = '/login' }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuth = localStorage.getItem('isAuth') === 'true';

  if (!isAuth) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  return children;
}
