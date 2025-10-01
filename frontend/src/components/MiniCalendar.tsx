import { useState } from 'react';

const MiniCalendar = () => {
  const [today] = useState(new Date());

  const month = today.toLocaleString('default', { month: 'short' });
  const year = today.getFullYear();

  // very small static calendar grid for mockup
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="text-center">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">{month} {year}</div>
        <div className="text-xs text-slate-500">Su L Ma Mi J V S</div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map(d => (
          <div key={d} className={`p-2 rounded ${d === today.getDate() ? 'bg-slate-800 text-white' : 'bg-slate-50'}`}>{d}</div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
