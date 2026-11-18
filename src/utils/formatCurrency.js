const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) {
    return ngnFormatter.format(0);
  }
  return ngnFormatter.format(numeric);
}

export function formatSignedCurrency(amount, type) {
  const formatted = formatCurrency(Math.abs(Number(amount) || 0));
  return type === 'income' ? `+ ${formatted}` : `- ${formatted}`;
}

export function formatNetCurrency(amount) {
  const numeric = Number(amount) || 0;
  if (numeric < 0) {
    return `- ${formatCurrency(Math.abs(numeric))}`;
  }
  if (numeric > 0) {
    return `+ ${formatCurrency(numeric)}`;
  }
  return formatCurrency(0);
}

export function formatCompactNaira(value) {
  const num = Number(value) || 0;
  if (num === 0) return '0';
  if (Math.abs(num) >= 1_000_000) {
    const millions = num / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    const thousands = num / 1_000;
    return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
  }
  return String(Math.round(num));
}
