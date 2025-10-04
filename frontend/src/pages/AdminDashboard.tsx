import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import PatientImport from '../components/PatientImport';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const displayName = user?.fullname || user?.email || 'Juan Pérez';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'audit'>('dashboard');

  return (
    <div className="flex">
      <AdminSidebar active="usuarios" />
      <div className="flex-1 p-6 bg-slate-100 min-h-screen">
        {/* Tarjeta de Perfil */}
        <section className="bg-slate-800 text-white rounded-2xl p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-semibold">
              {displayName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-semibold">{displayName}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-600">Administrador</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white">Activo</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm border border-white/10"
              onClick={() => {/* navegar a perfil */}}
            >
              Ver Perfil
            </button>
            <button
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm border border-white/10"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </section>

        {/* Pestañas secundarias */}
        <div className="mt-6">
          <div className="inline-flex bg-white p-1 rounded-full border border-slate-200">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'config', label: 'Configuraciones' },
              { key: 'audit', label: 'Auditoría' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTab === t.key ? 'bg-slate-800 text-white' : 'text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Métricas del sistema */}
        <section className="mt-6 bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Tendencia de Usuarios Activos</h3>
            <span className="text-xs text-slate-500">Últimas 12 semanas</span>
          </div>
          {/* Gráfico de barras estático */}
          <div className="mt-4 h-40 flex items-end gap-2">
            {[20, 35, 30, 45, 50, 38, 60, 48, 72, 66, 70, 64].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-200 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-slate-500">Usuarios Activos</div>
            <div className="mt-2 text-3xl font-bold">150</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-slate-500">Pacientes Registrados</div>
            <div className="mt-2 text-3xl font-bold">300</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-slate-500">Accesos Fallidos</div>
            <div className="mt-2 text-3xl font-bold">12</div>
          </div>
        </section>

        {/* Importar pacientes */}
        <section className="mt-8 bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-2">Importar Datos de Pacientes</h3>
          <PatientImport />
        </section>

        {/* Secciones inferiores */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white p-6 rounded-xl border lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nuevas Incidencias</h3>
              <button className="px-3 py-2 bg-slate-800 text-white rounded text-sm">Ver Todas las Incidencias</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Intento de acceso no autorizado', level: 'Urgente', color: 'bg-rose-500' },
                { title: 'Credenciales inválidas repetidas', level: 'Moderado', color: 'bg-amber-400' },
                { title: 'Cambio de rol aprobado', level: 'Info', color: 'bg-slate-400' },
              ].map((i, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800 text-sm pr-2">{i.title}</div>
                    <span className={`px-2 py-0.5 text-xs text-white rounded-full ${i.color}`}>{i.level}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">Hace {idx + 1} h • Sistema</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Actividad de Accesos</h3>
              <span className="text-xs text-slate-500">Últimos 7 días</span>
            </div>
            {/* Gráfico de líneas estático */}
            <div className="mt-2 h-40">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="0" y="0" width="200" height="100" fill="white" />
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  points="0,80 30,60 60,65 90,40 120,50 150,35 180,45 200,30"
                />
                <line x1="0" y1="80" x2="200" y2="80" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e2e8f0" strokeWidth="1" />
              </svg>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
