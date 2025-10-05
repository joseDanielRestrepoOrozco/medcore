import { useAuth } from '../context/AuthContext';

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="py-3 border-b border-slate-200 last:border-b-0">
    <div className="md:flex md:items-center md:justify-between gap-3">
      <span className="text-slate-500 block">{label}</span>
      <span className="text-slate-800 font-medium block md:text-right mt-1 md:mt-0">
        {value || 'Sin especificar'}
      </span>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const name = user?.fullname || user?.email || 'Usuario';
  const isVerified = ((user?.status || '') as string).toUpperCase() === 'VERIFIED';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6 md:p-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl md:text-3xl font-bold text-slate-600">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{name}</h1>
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                {isVerified ? 'Correo verificado' : 'Correo no verificado'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-xl p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Información básica</h2>
            <InfoRow label="Género" />
            <InfoRow label="Fecha de nacimiento" />
          </div>

          <div className="bg-slate-50 rounded-xl p-5">
            <h2 className="font-semibold text-slate-800 mb-3">Contacto</h2>
            <InfoRow label="Correo" value={user?.email || undefined} />
            <InfoRow label="Teléfono" />
          </div>

          <div className="bg-slate-50 rounded-xl p-5 md:col-span-2">
            <h2 className="font-semibold text-slate-800 mb-3">Dirección</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoRow label="Dirección" />
              <InfoRow label="Ciudad" />
              <InfoRow label="País" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-500">
          Puedes completar estos datos más adelante.
        </div>
      </div>
    </div>
  );
};

export default Profile;
