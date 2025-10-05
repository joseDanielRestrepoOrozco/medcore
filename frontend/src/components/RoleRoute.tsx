import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'admin' | 'patient' | 'medico';

const RoleRoute: React.FC<{ allowed: Role[]; children: React.ReactNode }> = ({ allowed, children }) => {
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';
  if (isAuthDisabled) return <>{children}</>;

  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  const role = (user as typeof user & { role?: Role })?.role;
  if (!role) return <Navigate to="/dashboard" replace />;
  if (!allowed.includes(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export default RoleRoute;

