import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.fullname || user?.email || 'Juan Pérez';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersActive, setUsersActive] = useState<number>(0);
  const [patientsTotal, setPatientsTotal] = useState<number>(0);
  const [newUsersWeek, setNewUsersWeek] = useState<number>(0);
  const [feed, setFeed] = useState<Array<{ title: string; level: 'Info' | 'Alerta'; when: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        // Usuarios activos (VERIFIED)
        const u = await api.get('/users', { params: { status: 'VERIFIED', limit: 1, page: 1 } });
        setUsersActive(u.data?.pagination?.total || 0);

        // Total pacientes
        const p = await api.get('/patients', { params: { limit: 1, page: 1 } });
        setPatientsTotal(p.data?.pagination?.total || 0);

        // Nuevos usuarios en 7 días (aprox: primera página)
        const uList = await api.get('/users', { params: { limit: 50, page: 1 } });
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = (uList.data?.users || []).filter((it: any) => it.createdAt && new Date(it.createdAt).getTime() >= sevenDaysAgo);
        setNewUsersWeek(recent.length);

        // Feed reciente: mezcla de usuarios/pacientes últimos
        const pList = await api.get('/patients', { params: { limit: 10, page: 1 } });
        const usersEvents = (uList.data?.users || []).slice(0, 5).map((it: any) => ({
          title: `Nuevo usuario: ${it.fullname || it.email}`,
          level: 'Info' as const,
          when: it.createdAt || new Date().toISOString(),
        }));
        const patientEvents = (pList.data?.patients || []).slice(0, 5).map((it: any) => ({
          title: `Nuevo paciente: ${it.firstName} ${it.lastName}`,
          level: 'Info' as const,
          when: it.createdAt || new Date().toISOString(),
        }));
        const merged = [...usersEvents, ...patientEvents].sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime()).slice(0, 6);
        setFeed(merged);
      } catch (_) {
        // silencioso en panel
      }
    })();
  }, []);

  return (
    <div className="flex">
      {/* Static sidebar on md+ */}
      <div className="hidden md:block">
        <AdminSidebar active="panel" />
      </div>

      {/* Overlay sidebar on mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="w-72 bg-white border-l min-h-full p-0 shadow-xl">
            <AdminSidebar active="panel" />
          </div>
        </div>
      )}

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
            <Link
              to="/profile"
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-sm border border-white/10"
            >
              Ver Perfil
            </Link>
          </div>
        </section>

        {/* Pestañas secundarias eliminadas por requerimiento */}

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
            <div className="mt-2 text-3xl font-bold">{usersActive}</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-slate-500">Pacientes Registrados</div>
            <div className="mt-2 text-3xl font-bold">{patientsTotal}</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-slate-500">Nuevos (7 días)</div>
            <div className="mt-2 text-3xl font-bold">{newUsersWeek}</div>
          </div>
        </section>

        {/* Enlace a Carga Masiva */}
        <section className="mt-8 bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Carga Masiva</h3>
            <a href="/admin/carga" className="px-3 py-2 bg-slate-800 text-white rounded text-sm">Ir a Carga</a>
          </div>
          <p className="text-sm text-slate-600 mt-2">Administra la importación de pacientes desde el apartado dedicado.</p>
        </section>

        {/* Secciones inferiores */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white p-6 rounded-xl border lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Actividad reciente</h3>
              <Link to="/admin/usuarios" className="px-3 py-2 bg-slate-800 text-white rounded text-sm">Ver más</Link>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {feed.map((i, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800 text-sm pr-2">{i.title}</div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${i.level === 'Alerta' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-800'}`}>{i.level}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{new Date(i.when).toLocaleString()}</p>
                </div>
              ))}
              {feed.length === 0 && (
                <div className="p-4 rounded-lg border bg-slate-50 text-sm text-slate-600">Sin actividad reciente</div>
              )}
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
