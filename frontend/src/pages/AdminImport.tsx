import AdminSidebar from '../components/AdminSidebar';
import PatientImport from '../components/PatientImport';
import { useState } from 'react';

const AdminImport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex">
      <div className="hidden md:block">
        <AdminSidebar active="carga" />
      </div>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="w-72 bg-white border-l min-h-full p-0 shadow-xl">
            <AdminSidebar active="carga" />
          </div>
        </div>
      )}
      <div className="flex-1 p-4 md:p-6 bg-slate-100 min-h-screen">
        <button type="button" className="md:hidden mb-4 px-3 py-2 rounded border bg-white" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">Menú</button>
        <section className="bg-white p-6 rounded-xl border">
          <h1 className="text-2xl font-bold mb-2">Carga Masiva de Pacientes</h1>
          <p className="text-sm text-slate-600 mb-4">Solo formatos CSV o XLSX (límite 60MB). Campos sugeridos: firstName,lastName,email,phone,gender,dateOfBirth.</p>
          <PatientImport />
        </section>
      </div>
    </div>
  );
};

export default AdminImport;

