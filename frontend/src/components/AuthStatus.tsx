import { useEffect, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuId = 'user-menu';

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {/* Nombre del usuario: texto/enlace y dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="text-sm text-slate-900 hover:underline"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-expanded={open}
        >
          {displayName}
        </button>
        {open && (
          <div
            id={menuId}
            role="menu"
            aria-labelledby={menuId}
            className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg p-1 text-sm"
          >
            <Link to="/profile" role="menuitem" className="block px-3 py-2 rounded hover:bg-slate-50">
              Ver Perfil
            </Link>
            <Link to="/settings" role="menuitem" className="block px-3 py-2 rounded hover:bg-slate-50">
              Configuración
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              role="menuitem"
              className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 text-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Botón tipo píldora hacia el panel */}
      <Link
        to="/admin"
        className="px-4 py-2 rounded-full text-sm font-medium bg-slate-800 text-white shadow-md border-2 border-slate-800 hover:bg-slate-900"
      >
        Dashboard
      </Link>

      {/* Icono circular para salir */}
      <button
        type="button"
        onClick={logout}
        aria-label="Cerrar sesión"
        className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center bg-white"
        title="Salir"
      >
        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4h6a2 2 0 012 2v3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19a2 2 0 01-2 2H7" />
        </svg>
      </button>
    </div>
  );
};

export default AuthStatus;
