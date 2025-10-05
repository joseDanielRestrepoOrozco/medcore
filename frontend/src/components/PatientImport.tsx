import React, { useRef, useState } from 'react';
import api from '../services/api';

type Props = {
  onProcess?: (file: File) => void;
};

// Plantilla con columnas requeridas por el backend
// fecha_nacimiento debe ir en formato YYYY-MM-DD
const sampleCsv = `nombre,apellido,fecha_nacimiento,correo,telefono,genero\nAna,Gomez,1990-03-12,ana@example.com,3001234567,FEMALE\nJuan,Perez,1985-10-02,juan@example.com,3019876543,MALE`;

const PatientImport: React.FC<Props> = ({ onProcess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const accept = '.csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';

  const handleBrowse = () => inputRef.current?.click();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    const allowed = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxBytes = 60 * 1024 * 1024; // 60MB
    if (f.size > maxBytes) {
      setMessage('El archivo supera el límite de 60MB');
      e.currentTarget.value = '';
      return;
    }
    const ext = f.name.toLowerCase().split('.').pop();
    if (!(allowed.includes(f.type) || (ext === 'csv' || ext === 'xlsx'))) {
      setMessage('Formato inválido. Solo CSV o XLSX');
      setFile(null);
      e.currentTarget.value = '';
      return;
    }
    setFile(f);
    setMessage(null);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0] || null;
    if (!f) return;
    const allowed = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxBytes = 60 * 1024 * 1024; // 60MB
    const ext = f.name.toLowerCase().split('.').pop();
    if (f.size > maxBytes) {
      setMessage('El archivo supera el límite de 60MB');
      return;
    }
    if (!(allowed.includes(f.type) || (ext === 'csv' || ext === 'xlsx'))) {
      setMessage('Formato inválido. Solo CSV o XLSX');
      setFile(null);
      return;
    }
    setFile(f);
    setMessage(null);
  };

  const downloadTemplate = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_pacientes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCsv = async (f: File) => {
    const raw = await f.text();
    // Remover BOM si existe
    const text = raw.replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [] as Array<Record<string, string>>;
    // Detectar delimitador: ';' o ',' (común en regionales)
    const first = lines[0];
    const delimiter = first.includes(';') && first.split(';').length > first.split(',').length ? ';' : ',';
    const header = (lines.shift() || '').split(delimiter).map((s) => s.trim());
    const rows = lines.map((line) => {
      const cols = line.split(delimiter);
      const obj: Record<string, string> = {};
      header.forEach((h, i) => (obj[h] = (cols[i] || '').trim()));
      return obj;
    });
    return rows;
  };

  const process = async () => {
    if (!file) return;
    if (file.name.toLowerCase().endsWith('.xlsx')) {
      setMessage('XLSX recibido. Conversión no soportada en cliente; usa CSV por ahora.');
      return;
    }
    setMessage('Procesando archivo...');
    try {
      const rows = await parseCsv(file);
      const payload = { patients: rows };
      const res = await api.post('/patients/bulk-import', payload);
      const ok = res.data?.summary?.successful ?? 0;
      const fail = res.data?.summary?.failed ?? 0;
      const failedRows: Array<{ index: number; error: string }> = res.data?.summary?.errors || res.data?.results?.failed?.map((r: any) => ({ index: r.index, error: r.error })) || [];
      let msg = `Importación completada. Éxitos: ${ok}, Fallidos: ${fail}`;
      if (fail > 0) {
        msg += `. Verifica que el CSV incluya la columna obligatoria fecha_nacimiento (YYYY-MM-DD) y datos válidos.`;
      }
      setMessage(msg);
      (window as any).__bulkErrors = failedRows; // exposición rápida para depurar desde consola si hace falta
      onProcess?.(file);
    } catch (e) {
      setMessage('Error procesando la importación');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Sube un archivo CSV o XLSX con la información de los pacientes.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl p-8 text-center transition border-2 ${dragOver ? 'border-slate-800 bg-slate-50 border-dashed' : 'border-slate-300 border-dashed'}`}
      >
        <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8M5 6h14v12H5z" />
        </svg>
        <p className="mt-3 text-sm text-slate-600">Arrastra y suelta o selecciona un archivo</p>
        <p className="text-xs text-slate-400">Solo CSV o XLSX (máx. 60MB)</p>
        <button type="button" onClick={handleBrowse} className="mt-4 px-4 py-2 rounded bg-white border border-slate-300 text-sm">
          Seleccionar Archivo
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        {file && <div className="mt-3 text-sm text-slate-700">Archivo: {file.name}</div>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={process}
          disabled={!file}
          className={`px-4 py-2 rounded text-white text-sm ${file ? 'bg-slate-800 hover:bg-slate-900' : 'bg-slate-400 cursor-not-allowed'}`}
        >
          Procesar Importación
        </button>
        <button type="button" onClick={downloadTemplate} className="text-sm text-slate-700 hover:underline">
          Descargar Plantilla CSV
        </button>
      </div>

      {message && <div className="text-sm text-slate-600">{message}</div>}
    </div>
  );
};

export default PatientImport;
