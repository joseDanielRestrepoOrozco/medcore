import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  const role = (user?.role || '').toUpperCase();
  if (role === 'ADMINISTRADOR') return <Navigate to="/admin" replace />;
  if (role === 'PACIENTE') return <Navigate to="/patient" replace />;
  if (role === 'MEDICO') return <Navigate to="/medico" replace />;
  return <Navigate to="/dashboard" replace />; // fallback por si falta rol
};

export default RoleRedirect;

