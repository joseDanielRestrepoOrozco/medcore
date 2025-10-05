import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';

type User = {
  id: string;
  email: string;
  fullname: string;
  role: string;
  status: string;
  createdAt?: string;
};

const ROLE_LABEL: Record<string, string> = {
  ADMINISTRADOR: 'Administrador',
  MEDICO: 'Médico',
  ENFERMERA: 'Enfermera',
  PACIENTE: 'Paciente',
};

const roleOptions = ['ADMINISTRADOR', 'MEDICO', 'ENFERMERA'] as const;

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'TODOS' | 'ADMINISTRADOR' | 'MEDICO' | 'ENFERMERA'>('TODOS');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter === 'TODOS' ? {} : { role: filter };
      const res = await api.get('/users', { params });
      const list = (res.data?.users || []) as User[];
      // Filtra fuera pacientes por seguridad
      setUsers(list.filter((u) => (u.role || '').toUpperCase() !== 'PACIENTE'));
    } catch (e) {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const changeRole = async (id: string, role: string) => {
    setSavingId(id);
    try {
      await api.put(`/users/${id}/role`, { role });
      await load();
    } catch (e) {
      setError('No fue posible cambiar el rol');
    } finally {
      setSavingId(null);
    }
  };

  const tabs = useMemo(
    () => [
      { key: 'TODOS', label: 'Todos' },
      { key: 'ADMINISTRADOR', label: 'Administradores' },
      { key: 'MEDICO', label: 'Médicos' },
      { key: 'ENFERMERA', label: 'Enfermeras' },
    ],
    []
  );

  return (
    <div className="flex">
      <div className="hidden md:block">
        <AdminSidebar active="usuarios" />
      </div>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="w-72 bg-white border-l min-h-full p-0 shadow-xl">
            <AdminSidebar active="usuarios" />
          </div>
        </div>
      )}

      <div className="flex-1 p-4 md:p-6 bg-slate-100 min-h-screen">
        <button type="button" className="md:hidden mb-4 px-3 py-2 rounded border bg-white" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">Menú</button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Usuarios</h1>
        </div>

        <div className="mt-4 inline-flex bg-white p-1 rounded-full border border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key as any)}
              className={`px-4 py-2 rounded-full text-sm ${filter === t.key ? 'bg-slate-800 text-white' : 'text-slate-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="mt-6">Cargando...</div>}
        {error && <div className="mt-6 text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="mt-6 bg-white border rounded-xl overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Correo</th>
                  <th className="text-left px-4 py-3">Rol</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const role = (u.role || '').toUpperCase();
                  return (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-3">{u.fullname || '-'}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{ROLE_LABEL[role] || role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${u.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={roleOptions.includes(role as any) ? role : 'MEDICO'}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          disabled={savingId === u.id}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {roleOptions.map((r) => (
                            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

