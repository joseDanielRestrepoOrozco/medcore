import { useState } from 'react';
import { signUp } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../components/InputField';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email({ error: 'Correo inválido' }),
  currentPassword: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .refine(val => /\d/.test(val), {
      message: 'La contraseña debe contener al menos un número',
    }),
  fullname: z.string().min(1, { message: 'El nombre es obligatorio' }),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      currentPassword: '',
      fullname: '',
    },
    mode: 'onTouched',
  });

  const errors = form.formState.errors;

  const onSubmit = form.handleSubmit(async data => {
    setLoading(true);
    setError(null);
    try {
      await signUp(data);
      navigate('/verify', { state: { email: data.email } });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      form.reset();
    }
  });

  if (errors.fullname || errors.email || errors.currentPassword) {
    console.log('There are validation errors:', errors);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Crear cuenta
        </h2>

        {error && (
          <div className="text-red-600 bg-red-100 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <InputField
            label="Nombre completo"
            name="fullname"
            placeholder="Nombre completo"
            register={form.register}
          />
          {errors.fullname && (
            <span className="text-red-600 text-sm mt-1">
              {errors.fullname.message}
            </span>
          )}
          <InputField
            label="Correo electrónico"
            name="email"
            placeholder="Correo"
            type="email"
            register={form.register}
          />
          {errors.email && (
            <span className="text-red-600 text-sm mt-1">
              {errors.email.message}
            </span>
          )}
          <InputField
            label="Contraseña"
            name="currentPassword"
            type="password"
            placeholder="Contraseña"
            register={form.register}
          />
          {errors.currentPassword && (
            <span className="text-red-600 text-sm mt-1">
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
