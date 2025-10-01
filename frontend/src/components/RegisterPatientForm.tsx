import { useState } from 'react';

const RegisterPatientForm = () => {
  const [form, setForm] = useState({ name: '', id: '', phone: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // TODO: conectar al backend
    console.log('Registrar paciente', form);
    alert('Paciente registrado (mock)');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="border p-2 rounded" />
      <input name="id" placeholder="Documento" value={form.id} onChange={handleChange} className="border p-2 rounded" />
      <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
      <div className="md:col-span-2 flex gap-3">
        <button type="button" onClick={() => setForm({ name: '', id: '', phone: '', email: '' })} className="px-4 py-2 border rounded">Cancelar</button>
        <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-slate-800 text-white rounded">Registrar Paciente</button>
      </div>
    </div>
  );
};

export default RegisterPatientForm;
