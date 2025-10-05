import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import MiniCalendar from '../components/MiniCalendar';
import { StatCard } from '../components/DashboardCards';
import PatientSummaryCards from '../components/PatientSummaryCards';
import { useState } from 'react';

const PatientDashboard = () => {
  // mock data for now
  const name = 'Ana Gómez';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
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
        <ProfileHeader name={name} role="Paciente" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Citas Pendientes" value={2} />
          <StatCard title="Medicamentos Hoy" value={3} />
          <StatCard title="Resultados" value={5} />
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Próximas Citas</h3>
              <p className="text-sm text-slate-500 mb-4">Revisa tus próximas citas médicas</p>
              <ul className="space-y-3">
                <li className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">Consulta Dermatología</div>
                    <div className="text-sm text-slate-500">Dr. Gómez — 15 de Marzo, 10:00 AM</div>
                  </div>
                  <div className="text-sm text-slate-400">17</div>
                </li>
                <li className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">Seguimiento Cardiología</div>
                    <div className="text-sm text-slate-500">Dr. Torres — 20 de Marzo, 11:00 AM</div>
                  </div>
                  <div className="text-sm text-slate-400">20</div>
                </li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Historia Clínica Electrónica</h3>
              <p className="text-sm text-slate-500 mb-4">Accede a tu historia clínica aquí</p>
              <button className="px-4 py-2 bg-slate-800 text-white rounded">Ver Historia</button>
            </section>

            <section className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Mensajes a mi Médico</h3>
              <form className="space-y-3">
                <input placeholder="Asunto" className="w-full border p-2 rounded" />
                <textarea placeholder="Mensaje" className="w-full border p-2 rounded h-24" />
                <button type="button" className="px-4 py-2 bg-slate-800 text-white rounded">Enviar Mensaje</button>
              </form>
            </section>
          </div>

          <aside className="space-y-6">
            <PatientSummaryCards />
            <div className="bg-white p-4 rounded shadow">
              <MiniCalendar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
