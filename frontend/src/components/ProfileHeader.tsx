import React from 'react';

const ProfileHeader: React.FC<{ name: string; role?: string }> = ({ name, role }) => {
  return (
    <div className="bg-slate-600 text-white p-4 rounded flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-slate-400 rounded-full flex items-center justify-center">👤</div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-slate-200">{role || 'Médico'}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 bg-slate-200 text-slate-800 rounded">Ver Perfil</button>
        <button className="px-3 py-1 bg-slate-800 text-white rounded">Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default ProfileHeader;
