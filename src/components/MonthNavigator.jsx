import { formatMonthLabel } from '../utils/dates';

export default function MonthNavigator({
  year,
  monthIndex,
  isCurrentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}) {
  const monthLabel = formatMonthLabel(year, monthIndex);

  return (
    <div className="month-nav" role="group" aria-label="Month navigation">
      <div className="month-nav-controls">
        <button
          type="button"
          className="icon-circle-btn"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <i className="fa-solid fa-chevron-left" aria-hidden="true" />
        </button>

        <span className="month-nav-label" aria-live="polite">
          {monthLabel}
        </span>

        <button
          type="button"
          className="icon-circle-btn"
          onClick={onNextMonth}
          disabled={isCurrentMonth}
          aria-label="Next month"
        >
          <i className="fa-solid fa-chevron-right" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className="btn-secondary btn-sm"
        onClick={onToday}
        disabled={isCurrentMonth}
      >
        Today
      </button>
    </div>
  );
}
