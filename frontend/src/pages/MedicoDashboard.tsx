import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import { StatCard } from '../components/DashboardCards';
import { useState } from 'react';

const MedicoDashboard = () => {
  const name = 'Dr. Méndez';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Responsive sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-4 md:p-6 bg-slate-100 min-h-screen">
        {/* mobile toggle */}
        <button
          type="button"
          className="md:hidden mb-4 px-3 py-2 rounded border bg-white"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          Menú
        </button>

        <ProfileHeader name={name} role="Médico" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Pacientes Hoy" value={8} />
          <StatCard title="Citas Completadas" value={5} />
          <StatCard title="Alertas" value={1} />
        </div>

        <section className="mt-8 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Agenda</h3>
          <p className="text-sm text-slate-600">Tu agenda del día con próximas consultas.</p>
        </section>
      </div>
    </div>
  );
};

export default MedicoDashboard;

