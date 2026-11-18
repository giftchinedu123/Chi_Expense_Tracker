export function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString() {
  return toDateString(new Date());
}

export function parseLocalDate(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

const displayDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const monthLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

export function formatDisplayDate(dateStr) {
  const date = parseLocalDate(dateStr);
  if (!date) return dateStr || '';
  return displayDateFormatter.format(date);
}

export function formatShortDate(dateStr) {
  const date = parseLocalDate(dateStr);
  if (!date) return dateStr || '';
  return shortDateFormatter.format(date);
}

export function formatMonthLabel(year, monthIndex) {
  const date = new Date(year, monthIndex, 1);
  return monthLabelFormatter.format(date);
}

export function toMonthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function getMonthKey(dateStr) {
  return typeof dateStr === 'string' ? dateStr.slice(0, 7) : '';
}

export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function getMonthDateRange(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  return {
    from: toDateString(firstDay),
    to: toDateString(lastDay),
  };
}

export function getPresetRange(presetKey, transactions = []) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (presetKey) {
    case 'this_month': {
      return getMonthDateRange(currentYear, currentMonth);
    }
    case 'last_month': {
      const prevDate = new Date(currentYear, currentMonth - 1, 1);
      return getMonthDateRange(prevDate.getFullYear(), prevDate.getMonth());
    }
    case 'last_30_days': {
      const start = new Date(currentYear, currentMonth, now.getDate() - 29);
      return {
        from: toDateString(start),
        to: toDateString(now),
      };
    }
    case 'this_year': {
      return {
        from: toDateString(new Date(currentYear, 0, 1)),
        to: toDateString(new Date(currentYear, 11, 31)),
      };
    }
    case 'all_time': {
      if (!transactions.length) {
        const today = toDateString(now);
        return { from: today, to: today };
      }
      const dates = transactions
        .map((t) => t.date)
        .filter(Boolean)
        .sort();
      return {
        from: dates[0],
        to: dates[dates.length - 1],
      };
    }
    default:
      return getMonthDateRange(currentYear, currentMonth);
  }
}
