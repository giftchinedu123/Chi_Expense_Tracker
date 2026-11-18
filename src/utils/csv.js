function escapeCsvField(value) {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateTransactionsCsv(transactions) {
  const sorted = [...transactions].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return (a.createdAt || 0) - (b.createdAt || 0);
  });

  const header = 'Date,Title,Type,Category,Amount';
  const rows = sorted.map((tx) => {
    const fields = [
      tx.date,
      tx.title,
      tx.type,
      tx.category,
      Number(tx.amount),
    ];
    return fields.map(escapeCsvField).join(',');
  });

  return `\uFEFF${[header, ...rows].join('\r\n')}`;
}

export function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
