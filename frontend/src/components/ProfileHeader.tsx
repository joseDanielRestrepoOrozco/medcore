import React from 'react';

const ProfileHeader: React.FC<{ name: string; role?: string }> = ({ name, role }) => {
  return (
    <div className="bg-slate-600 text-white p-4 rounded flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-slate-400 rounded-full flex items-center justify-center">👤</div>
        <div>
          <div className="font-semibold">{name}</div>
          {role && <div className="text-sm text-slate-200">{role}</div>}
        </div>
      </div>
      {/* Acciones removidas para evitar duplicar Cerrar Sesión. Usar Navbar/AuthStatus. */}
    </div>
  );
};

export default ProfileHeader;
