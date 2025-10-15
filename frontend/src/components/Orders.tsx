const Orders = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Órdenes Médicas Recientes</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">Pacientes con Órdenes Nuevas</div>
        <div className="p-4 bg-white rounded shadow">Órdenes Pendientes</div>
      </div>
    </div>
  );
};

export default Orders;
