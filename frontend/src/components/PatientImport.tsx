import React, { useRef, useState } from 'react';

type Props = {
  onProcess?: (file: File) => void;
};

const sampleCsv = `nombre,apellido,documento,correo\nAna,Gomez,12345678,ana@example.com\nJuan,Perez,87654321,juan@example.com`;

const PatientImport: React.FC<Props> = ({ onProcess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const accept = '.csv,application/json';

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setMessage(null);
    }
  };

  const handleBrowse = () => inputRef.current?.click();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      setFile(f);
      setMessage(null);
    }
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

  const process = () => {
    if (!file) return;
    setMessage('Procesando archivo...');
    // Simulación de procesamiento
    setTimeout(() => {
      setMessage(`Importación completada: ${file.name}`);
      onProcess?.(file);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Suba un archivo CSV o JSON con la información de los pacientes.</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center transition ${
          dragOver ? 'border-slate-800 bg-slate-50' : 'border-slate-300'
        }`}
      >
        <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a4 4 0 010 8H7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3-3-3 3m3-3v12" />
        </svg>
        <p className="mt-3 text-sm text-slate-600">Arrastra y suelta un archivo aquí</p>
        <p className="text-xs text-slate-400">CSV o JSON</p>
        <button type="button" onClick={handleBrowse} className="mt-4 px-4 py-2 rounded bg-white border border-slate-300 text-sm">
          Seleccionar Archivo
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        {file && <div className="mt-3 text-sm text-slate-700">Archivo seleccionado: {file.name}</div>}
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

