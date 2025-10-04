import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const items = [
    { key: 'historia', label: 'Historia Clínica' },
    { key: 'signos', label: 'Signos Vitales' },
    { key: 'medicamentos', label: 'Medicamentos' },
    { key: 'calendario', label: 'Calendario de Citas' },
    { key: 'alertas', label: 'Alertas' },
  ];

  return (
    <aside className="w-56 bg-slate-50 border-r min-h-screen p-4">
      <nav className="space-y-2">
        {items.map(item => (
          <Link key={item.key} to="#" className="block px-3 py-2 rounded text-sm text-slate-700 hover:bg-slate-100">{item.label}</Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
