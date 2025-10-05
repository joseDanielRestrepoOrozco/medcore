import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCESS_CODE = 'IDACSOFT';

const SolicitarRegistro: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      // Concede acceso temporal a la pantalla de creación de cuenta (admin)
      sessionStorage.setItem('signup_access', 'granted');
      navigate('/signup');
    } else {
      setError('Código inválido. Solicita autorización al administrador.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-11rem)] bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Solicitar registro</h2>
        <p className="text-slate-600 mb-6">Ingresa el código de acceso para continuar.</p>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4 font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de acceso"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition"
          />
          <button
            type="submit"
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarRegistro;
