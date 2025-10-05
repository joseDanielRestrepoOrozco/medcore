import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const name = user?.fullname || user?.email || 'Usuario';
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="space-y-2">
        <div><span className="text-slate-500">Nombre: </span>{name}</div>
        <div><span className="text-slate-500">Email: </span>{user?.email}</div>
        <div><span className="text-slate-500">Estado: </span>{user?.status}</div>
      </div>
    </div>
  );
};

export default Profile;

