const PatientSummaryCards = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold">Resumen de Salud</h4>
        <p className="text-sm text-slate-500">Tu estado de salud actual en un vistazo</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-slate-50 rounded">2<br/><span className="text-xs text-slate-400">Citas</span></div>
          <div className="p-2 bg-slate-50 rounded">3<br/><span className="text-xs text-slate-400">Medicamentos</span></div>
          <div className="p-2 bg-slate-50 rounded">5<br/><span className="text-xs text-slate-400">Resultados</span></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold">Acciones</h4>
        <div className="mt-3 flex flex-col gap-2">
          <button className="px-3 py-2 bg-slate-800 text-white rounded text-sm">Agendar Nueva Cita</button>
          <button className="px-3 py-2 border rounded text-sm">Ver Historia Clínica</button>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryCards;
