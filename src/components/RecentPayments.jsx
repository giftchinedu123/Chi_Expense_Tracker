import { Link } from 'react-router-dom';
import { formatDisplayDate } from '../utils/dates';
import { formatSignedCurrency } from '../utils/formatCurrency';

export default function RecentPayments({ transactions, monthLabel }) {
  return (
    <section className="panel-section" aria-labelledby="recent-payments-heading">
      <div className="section-header">
        <h2 id="recent-payments-heading" className="section-title">
          Recent Payments
        </h2>
        <Link to="/transactions" className="text-link">
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="inline-empty">
          <p>No transactions recorded for {monthLabel}.</p>
        </div>
      ) : (
        <ul className="recent-list">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <li key={tx.id} className="recent-item">
                <div className="recent-item-left">
                  <span
                    className={`tx-indicator ${
                      isIncome ? 'is-income' : 'is-expense'
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`tx-dot ${
                        isIncome ? 'dot-solid' : 'dot-hollow'
                      }`}
                    />
                    <i
                      className={`fa-solid ${
                        isIncome ? 'fa-arrow-up' : 'fa-arrow-down'
                      } tx-arrow`}
                    />
                  </span>
                  <div className="recent-item-meta">
                    <span className="recent-item-title">{tx.title}</span>
                    <span className="recent-item-date">
                      {formatDisplayDate(tx.date)}
                    </span>
                  </div>
                </div>

                <span className="recent-item-amount tabular-nums">
                  {formatSignedCurrency(tx.amount, tx.type)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
