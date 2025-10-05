import { useEffect, useState } from 'react';
import Sidebar from '../components/AdminSidebar';
import api from '../services/api';

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  age: number;
  state: string;
  createdAt: string;
};

const AdminPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/patients?limit=20&page=1');
        setPatients(res.data.patients || []);
      } catch (e) {
        setError('No se pudieron cargar los pacientes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar active="pacientes" />
      </div>
      <div className="flex-1 p-4 md:p-6 bg-slate-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Pacientes</h1>
        {loading && <div>Cargando...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Teléfono</th>
                  <th className="text-left px-4 py-3">Edad</th>
                  <th className="text-left px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">{p.firstName} {p.lastName}</td>
                    <td className="px-4 py-3">{p.email || '-'}</td>
                    <td className="px-4 py-3">{p.phone || '-'}</td>
                    <td className="px-4 py-3">{p.age}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${p.state === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {p.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;

