import { useEffect, useState } from 'react';
import { signUp } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../components/InputField';
import { z } from 'zod';

// Validaciones alineadas con el backend (zod en backend limita a max 6 y requiere un número)
const signUpSchema = z.object({
  fullname: z.string().min(1, { message: 'El nombre es obligatorio' }),
  email: z.string().email({ message: 'Correo inválido' }),
  currentPassword: z
    .string()
    .min(1, { message: 'La contraseña es obligatoria' })
    .max(6, { message: 'Máximo 6 caracteres' })
    .refine((val) => /\d/.test(val), {
      message: 'Debe contener al menos un número',
    }),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Bloquear acceso directo si no pasó por "Solicitar registro"
  useEffect(() => {
    const allowed = sessionStorage.getItem('signup_access') === 'granted';
    if (!allowed) navigate('/solicitar-registro', { replace: true });
  }, [navigate]);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      currentPassword: '',
      fullname: '',
    },
    mode: 'onChange',
  });

  const errors = form.formState.errors as {
    fullname?: { message?: string };
    email?: { message?: string };
    currentPassword?: { message?: string };
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // La creación de cuenta es para Administradores. El backend asigna rol por defecto
      // o puede aceptarlo en el payload si está soportado.
      await signUp({ ...data, role: 'ADMINISTRADOR' } as any);
      navigate('/verify', { state: { email: data.email } });
      form.reset();
      sessionStorage.removeItem('signup_access');
    } catch (err: unknown) {
      // Si el backend devolvió detalles de validación por campo, pintarlos abajo de cada input
      const ax = err as {
        response?: { status?: number; data?: { error?: unknown; details?: Record<string, string[]> } };
      };
      const status = ax?.response?.status;
      const details = ax?.response?.data?.details;
      if (status === 400 && details && typeof details === 'object') {
        Object.entries(details).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          if (['fullname', 'email', 'currentPassword'].includes(field)) {
            form.setError(field as 'fullname' | 'email' | 'currentPassword', {
              type: 'server',
              message: msg,
            });
          }
        });
        setError('Revisa los campos marcados.');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  });

  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-11rem)] bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Crear cuenta
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <InputField
            label="Nombre completo"
            name="fullname"
            placeholder="Nombre completo"
            register={form.register}
            error={errors.fullname?.message}
          />
          <InputField
            label="Correo electrónico"
            name="email"
            placeholder="Correo"
            type="email"
            register={form.register}
            error={errors.email?.message}
          />
          <label className="block mt-4">
            Contraseña
            <div className="relative">
              <input
                {...form.register('currentPassword')}
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                className={
                  'w-full px-4 py-3 pr-20 rounded-lg outline-none transition placeholder:text-left ' +
                  (errors.currentPassword?.message
                    ? 'border border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-300 '
                    : 'border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 ')
                }
                aria-invalid={Boolean(errors.currentPassword) || undefined}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-slate-600 hover:text-slate-800"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </label>
          {errors.currentPassword?.message && (
            <span className="block text-red-600 text-sm mt-1">
              {errors.currentPassword.message}
            </span>
          )}
          <button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="w-full py-3 mt-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <a
            href="/login"
            className="text-slate-800 font-semibold hover:underline"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
