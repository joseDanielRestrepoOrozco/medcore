import React from 'react';
import { Link } from 'react-router-dom';

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  const IconFile = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3h6l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  );
  const IconHeart = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.657 3.172 10.828a4 4 0 010-5.656z" />
    </svg>
  );
  const IconPill = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 11-14 0 7 7 0 0114 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
    </svg>
  );
  const IconCalendar = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  const IconBell = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  const items = [
    { key: 'historia', label: 'Historia Clínica', icon: IconFile },
    { key: 'signos', label: 'Signos Vitales', icon: IconHeart },
    { key: 'medicamentos', label: 'Medicamentos', icon: IconPill },
    { key: 'calendario', label: 'Calendario de Citas', icon: IconCalendar },
    { key: 'alertas', label: 'Alertas', icon: IconBell },
  ];

  return (
    <>
      {/* Static sidebar on md+ */}
      <aside className="hidden md:block w-56 bg-slate-50 border-r min-h-screen p-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.key}
              to="#"
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-slate-700 hover:bg-slate-100"
            >
              <span className="text-slate-500">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay sidebar on mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="flex-1 bg-black/30"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* panel */}
          <aside className="w-64 bg-white border-l min-h-full p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Menú</span>
              <button
                type="button"
                onClick={onClose}
                className="px-2 py-1 border rounded"
                aria-label="Cerrar menú"
              >
                Cerrar
              </button>
            </div>
            <nav className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.key}
                  to="#"
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm text-slate-700 hover:bg-slate-100"
                >
                  <span className="text-slate-500">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
