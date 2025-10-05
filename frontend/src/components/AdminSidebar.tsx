import React from 'react';
import { Link } from 'react-router-dom';

type Item = {
  key: string;
  label: string;
  to?: string;
  icon: React.ReactNode;
};

const IconUsers = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

const IconPatients = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6M7 8h10M5 6h14v12H5z" />
  </svg>
);

const IconFinance = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3h6c0-1.657-1.343-3-3-3zM5 10h14v10H5zM8 4h8l1 4H7l1-4z" />
  </svg>
);

const IconReports = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6h6v6M9 7h6M5 21h14V3H5v18z" />
  </svg>
);

const IconSettings = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8a4 4 0 100 8 4 4 0 000-8zm-7.4 4a7.4 7.4 0 011.1-3.9l-1.7-1.7 1.4-1.4 1.7 1.7A7.4 7.4 0 0112 4.6V2h2v2.6a7.4 7.4 0 013.9 1.1l1.7-1.7 1.4 1.4-1.7 1.7A7.4 7.4 0 0121.4 12H24v2h-2.6a7.4 7.4 0 01-1.1 3.9l1.7 1.7-1.4 1.4-1.7-1.7a7.4 7.4 0 01-3.9 1.1V24h-2v-2.6a7.4 7.4 0 01-3.9-1.1l-1.7 1.7-1.4-1.4 1.7-1.7A7.4 7.4 0 012.6 14H0v-2h2.6z" />
  </svg>
);

const AdminSidebar: React.FC<{ active?: string }> = ({ active = 'usuarios' }) => {
  const items: Item[] = [
    { key: 'panel', label: 'Panel de Control', icon: IconReports, to: '/admin' },
    { key: 'usuarios', label: 'Usuarios', icon: IconUsers, to: '/admin/usuarios' },
    { key: 'pacientes', label: 'Pacientes', icon: IconPatients, to: '/admin/pacientes' },
    { key: 'carga', label: 'Carga Masiva', icon: IconFinance, to: '/admin/carga' },
    { key: 'reportes', label: 'Reportes', icon: IconReports },
    { key: 'ajustes', label: 'Ajustes', icon: IconSettings },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              to={item.to || '#'}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-l-4 border-slate-800'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-slate-600">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
