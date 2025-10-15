import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/error';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../components/InputField';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: doLogin } = useAuth();

  const schema = z.object({
    email: z.email({ message: 'Correo inválido' }),
    currentPassword: z
      .string()
      .min(1, { message: 'Contraseña requerida' })
      .max(6, { message: 'Máximo 6 caracteres' })
      .refine(val => /\d/.test(val), {
        message: 'Debe contener al menos un número',
      }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', currentPassword: '' },
    mode: 'onChange',
  });

  const errors = form.formState.errors as {
    email?: { message?: string };
    currentPassword?: { message?: string };
  };

  const onSubmit = form.handleSubmit(async data => {
    setLoading(true);
    setError(null);
    try {
      const res = await login({
        email: data.email,
        current_password: data.currentPassword,
      });
      const token = res.data.token;
      const user = res.data.user;
      doLogin(token, user);
      const role = user.role;
      switch (role) {
        case 'ADMINISTRADOR':
          navigate('/admin');
          break;
        case 'PACIENTE':
          navigate('/patient');
          break;
        case 'MEDICO':
          navigate('/medico');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { error?: unknown } };
      };
      const status = ax?.response?.status;
      const raw = String(ax?.response?.data?.error || '');
      const msg = raw.toLowerCase();
      if (status === 401) {
        if (msg.includes('email no verificado')) {
          setError('Debes verificar tu correo antes de iniciar sesión.');
          form.setError('email', {
            type: 'server',
            message: 'Correo pendiente por verificación',
          });
        } else {
          setError('Correo o contraseña incorrectos.');
          form.setError('email', {
            type: 'server',
            message: 'Revisa tu correo',
          });
          form.setError('currentPassword', {
            type: 'server',
            message: 'Revisa tu contraseña',
          });
        }
      } else if (status === 400) {
        setError('Revisa los campos marcados.');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-11rem)] bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Iniciar sesión
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <InputField
            label="Correo"
            name="email"
            placeholder="Correo"
            register={form.register}
            error={errors.email?.message}
          />
          <label className="block">
            Contraseña
            <div className="relative">
              <input
                {...form.register('currentPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className={
                  'w-full px-4 py-3 pr-12 rounded-lg outline-none transition placeholder:text-left ' +
                  (errors.currentPassword?.message
                    ? 'border border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-300 '
                    : 'border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 ')
                }
                aria-invalid={Boolean(errors.currentPassword) || undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-slate-600 hover:text-slate-800"
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>
          {errors.currentPassword?.message && (
            <span className="block text-red-600 text-sm -mt-3">
              {errors.currentPassword.message}
            </span>
          )}

          <button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          ¿No tienes cuenta?{' '}
          <a
            href="/solicitar-registro"
            className="text-slate-800 font-semibold hover:underline"
          >
            Solicitar registro
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
