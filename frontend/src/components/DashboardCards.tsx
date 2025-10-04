import React from 'react';

export const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="p-4 bg-white rounded shadow">
    <div className="text-sm text-slate-500">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

export const PatientCard: React.FC<{ name: string; status: string }> = ({ name, status }) => (
  <div className="p-4 bg-white rounded shadow flex items-center gap-4">
    <div className="h-12 w-12 bg-slate-200 rounded-full" />
    <div>
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-slate-500">Estado: <span className="font-medium">{status}</span></div>
    </div>
  </div>
);
