import { useState } from 'react';
import { signUp } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/error';

const SignUp = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp({ fullname, email, currentPassword: password });
      navigate('/verify', { state: { email } });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Crear cuenta</h2>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={fullname}
            onChange={e => setFullname(e.target.value)}
            placeholder="Nombre completo"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-slate-800 font-semibold hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
