import { exportToCSV } from '../utils/export';

const IncidentsList = () => {
  const incidents = [
    { id: 1, title: 'Incidencia 1', desc: 'Usuario no autorizado detectado' },
    { id: 2, title: 'Incidencia 2', desc: 'Actividad sospechosa en cuenta' },
  ];

  return (
    <div className="space-y-4">
      {incidents.map(i => (
        <div key={i.id} className="p-4 border rounded bg-slate-50">
          <div className="font-semibold">{i.title}</div>
          <div className="text-sm text-slate-500">{i.desc}</div>
        </div>
      ))}
      <div className="mt-3 flex gap-3">
        <button className="px-3 py-2 bg-slate-800 text-white rounded">Ver Todas las Incidencias</button>
        <button
          type="button"
          onClick={() => exportToCSV('incidencias.csv', incidents)}
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          Exportar a CSV
        </button>
      </div>
    </div>
  );
};

export default IncidentsList;
