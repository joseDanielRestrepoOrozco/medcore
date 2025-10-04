import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Llama siempre a los hooks en el tope del componente
  const { token } = useAuth();
  const isAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';

  if (isAuthDisabled) return <>{children}</>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
