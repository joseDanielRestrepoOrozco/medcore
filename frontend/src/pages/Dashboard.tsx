import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import { StatCard, PatientCard } from '../components/DashboardCards';
import Orders from '../components/Orders';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-100 min-h-screen">
        <ProfileHeader name={user?.fullname || user?.email || 'Juan Pérez'} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Pacientes bajo cuidado" value={18} />
          <StatCard title="Medicaciones administradas" value={45} />
          <StatCard title="Incidencias reportadas" value={2} />
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Pacientes Actuales</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <PatientCard name="John Doe" status="Estable" />
            <PatientCard name="Maria Smith" status="Crítico" />
          </div>
        </div>

        <div className="mt-6">
          <Orders />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
