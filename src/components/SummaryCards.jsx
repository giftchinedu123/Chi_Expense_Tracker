import { formatCurrency, formatNetCurrency } from '../utils/formatCurrency';

export default function SummaryCards({
  balance,
  monthlyIncome,
  monthlyExpenses,
  monthLabel,
}) {
  return (
    <section className="summary-cards" aria-label="Financial summary">
      <article className="summary-card summary-card-balance">
        <span className="summary-label">Balance</span>
        <strong className="summary-amount summary-amount-lg tabular-nums">
          {balance < 0 ? formatNetCurrency(balance) : formatCurrency(balance)}
        </strong>
        <span className="summary-subtext">All-time net</span>
      </article>

      <article className="summary-card">
        <span className="summary-label">Income</span>
        <strong className="summary-amount tabular-nums">
          {formatCurrency(monthlyIncome)}
        </strong>
        <span className="summary-subtext">{monthLabel}</span>
      </article>

      <article className="summary-card">
        <span className="summary-label">Expenses</span>
        <strong className="summary-amount tabular-nums">
          {formatCurrency(monthlyExpenses)}
        </strong>
        <span className="summary-subtext">{monthLabel}</span>
      </article>
    </section>
  );
}
