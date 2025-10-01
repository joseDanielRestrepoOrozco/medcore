import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type GuestRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

// Evita que usuarios autenticados vean páginas de invitado (login/signup)
const GuestRoute: React.FC<GuestRouteProps> = ({ children, redirectTo = '/dashboard' }) => {
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';
  if (isAuthDisabled) return <>{children}</>;

  const { token } = useAuth();
  if (token) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
};

export default GuestRoute;

