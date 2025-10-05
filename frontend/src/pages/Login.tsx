import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/error';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: doLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login({ email, currentPassword: password });
      const token = res.data.token;
      const user = res.data.user as typeof res.data.user & { role?: 'admin' | 'patient' | 'medico' };
      doLogin(token, user);
      const role = user?.role;
      const dest = role === 'admin' ? '/admin' : role === 'patient' ? '/patient' : role === 'medico' ? '/medico' : '/dashboard';
      navigate(dest);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-11rem)] bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Iniciar sesión</h2>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition"
          />
          <div className="relative">
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 px-3 text-sm text-slate-600 hover:text-slate-800"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          ¿No tienes cuenta?{' '}
          <a href="/signup" className="text-slate-800 font-semibold hover:underline">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
