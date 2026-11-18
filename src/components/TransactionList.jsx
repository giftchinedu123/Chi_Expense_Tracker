import { formatDisplayDate } from '../utils/dates';
import { formatSignedCurrency } from '../utils/formatCurrency';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="tx-list-wrapper">
      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col" className="text-right">
                Amount
              </th>
              <th scope="col" className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <tr key={tx.id}>
                  <td>
                    <div className="tx-title-cell">
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
                      <span className="tx-title-text">{tx.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-pill">{tx.category}</span>
                  </td>
                  <td className="tx-date-cell">{formatDisplayDate(tx.date)}</td>
                  <td className="text-right tx-amount-cell tabular-nums">
                    {formatSignedCurrency(tx.amount, tx.type)}
                  </td>
                  <td className="text-right">
                    <div className="row-actions">
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => onEdit(tx)}
                        aria-label={`Edit ${tx.title}`}
                      >
                        <i className="fa-solid fa-pen" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => onDelete(tx)}
                        aria-label={`Delete ${tx.title}`}
                      >
                        <i className="fa-solid fa-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="tx-mobile-cards" aria-label="Transactions list">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <li key={tx.id} className="tx-mobile-card">
              <div className="tx-mobile-top">
                <div className="tx-title-cell">
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
                  <span className="tx-title-text">{tx.title}</span>
                </div>
                <span className="tx-amount-cell tabular-nums">
                  {formatSignedCurrency(tx.amount, tx.type)}
                </span>
              </div>

              <div className="tx-mobile-bottom">
                <div className="tx-mobile-meta">
                  <span className="category-pill">{tx.category}</span>
                  <span className="tx-date-cell">{formatDisplayDate(tx.date)}</span>
                </div>

                <div className="row-actions">
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => onEdit(tx)}
                    aria-label={`Edit ${tx.title}`}
                  >
                    <i className="fa-solid fa-pen" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => onDelete(tx)}
                    aria-label={`Delete ${tx.title}`}
                  >
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
