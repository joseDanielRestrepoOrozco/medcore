import { useState } from 'react';
import { verifyEmail, resendVerificationCode } from '../services/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/error';

const VerifyEmail = () => {
  const loc = useLocation() as unknown as { state?: { email?: string } };
  const prefilledEmail = loc.state?.email || '';
  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyEmail({ email, verificationCode: code });
      setSuccess('Correo verificado. Serás redirigido para iniciar sesión...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      await resendVerificationCode({ email });
      alert('Código reenviado');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-11rem)] flex items-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl mb-4 font-semibold">Verificar correo</h2>
        {success && <div className="text-green-700 bg-green-100 p-3 rounded mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleVerify} className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" className="w-full p-3 border rounded" />
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Código de verificación" className="w-full p-3 border rounded" />
          <button disabled={loading} className="w-full p-3 bg-green-600 text-white rounded">{loading ? 'Verificando...' : 'Verificar'}</button>
        </form>
        <button onClick={handleResend} className="mt-4 text-sm text-blue-600">Reenviar código</button>
      </div>
    </div>
  );
};

export default VerifyEmail;
