export function exportToCSV(filename: string, rows: Array<Record<string, unknown>>): void {
  if (!rows || rows.length === 0) {
    console.warn('exportToCSV: no data');
    return;
  }

  const headers = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row || {}).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (/[",\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const lines: string[] = [];
  lines.push(headers.join(','));
  for (const row of rows) {
    const line = headers.map((h) => escape((row as Record<string, unknown>)[h])).join(',');
    lines.push(line);
  }

  const csv = lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

