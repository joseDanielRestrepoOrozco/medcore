import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthStatus = () => {
  const { token, user, logout } = useAuth();

  if (!token) {
    return (
      <Link
        to="/login"
        aria-label="Iniciar sesión"
        title="Iniciar sesión"
        className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center bg-white"
      >
        <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Link>
    );
  }

  const displayName = user?.fullname || user?.email || 'Usuario';

  const rawRole = (user as typeof user & { role?: string })?.role || '';
  const role = rawRole.toUpperCase();
  const dashboardHref =
    role === 'ADMINISTRADOR' ? '/admin' : role === 'PACIENTE' ? '/patient' : role === 'MEDICO' ? '/medico' : '/dashboard';

  return (
    <div className="flex items-center space-x-4">
      {/* Nombre visible */}
      <span className="text-sm text-slate-900">{displayName}</span>

      {/* Quitar botón 'Dashboard': se redirige automáticamente por rol */}
      <Link to="/profile" className="px-4 py-2 rounded-full text-sm font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">Perfil</Link>
      <Link to="/settings" className="px-4 py-2 rounded-full text-sm font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">Configuración</Link>

      {/* Botón claro e intuitivo para salir */}
      <button type="button" onClick={logout} className="px-4 py-2 rounded-full text-sm font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50">Cerrar sesión</button>
    </div>
  );
};

export default AuthStatus;
