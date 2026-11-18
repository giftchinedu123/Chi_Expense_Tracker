import { useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTransactions } from '../hooks/useTransactions';
import { downloadCsv, generateTransactionsCsv } from '../utils/csv';
import { formatDisplayDate, getPresetRange } from '../utils/dates';
import {
  formatCurrency,
  formatNetCurrency,
  formatSignedCurrency,
} from '../utils/formatCurrency';

const PRESETS = [
  { key: 'this_month', label: 'This month' },
  { key: 'last_month', label: 'Last month' },
  { key: 'last_30_days', label: 'Last 30 days' },
  { key: 'this_year', label: 'This year' },
  { key: 'all_time', label: 'All time' },
];

export default function Export() {
  const { transactions } = useTransactions();
  const [activePreset, setActivePreset] = useLocalStorage(
    'expense_tracker_export_preset',
    'this_month'
  );

  const initialRange = getPresetRange(
    activePreset === 'custom' ? 'this_month' : activePreset,
    transactions
  );
  const [fromDate, setFromDate] = useState(initialRange.from);
  const [toDate, setToDate] = useState(initialRange.to);
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const handleSelectPreset = (presetKey) => {
    setActivePreset(presetKey);
    const range = getPresetRange(presetKey, transactions);
    setFromDate(range.from);
    setToDate(range.to);
    setDownloadSuccess('');
  };

  const handleFromChange = (value) => {
    setActivePreset('custom');
    setFromDate(value);
    setDownloadSuccess('');
  };

  const handleToChange = (value) => {
    setActivePreset('custom');
    setToDate(value);
    setDownloadSuccess('');
  };

  const isRangeInvalid = Boolean(fromDate && toDate && fromDate > toDate);

  const matchingTransactions = useMemo(() => {
    if (isRangeInvalid || !fromDate || !toDate) {
      return [];
    }
    return transactions
      .filter((tx) => tx.date >= fromDate && tx.date <= toDate)
      .sort((a, b) => {
        const dateOrder = a.date.localeCompare(b.date);
        if (dateOrder !== 0) return dateOrder;
        return (a.createdAt || 0) - (b.createdAt || 0);
      });
  }, [transactions, fromDate, toDate, isRangeInvalid]);

  const summary = useMemo(() => {
    return matchingTransactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.income += tx.amount;
        } else {
          acc.expenses += tx.amount;
        }
        acc.net = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, net: 0 }
    );
  }, [matchingTransactions]);

  const previewRows = useMemo(() => {
    return matchingTransactions.slice(0, 5);
  }, [matchingTransactions]);

  const handleDownload = () => {
    if (isRangeInvalid || matchingTransactions.length === 0) return;

    const csvContent = generateTransactionsCsv(matchingTransactions);
    const filename = `expense-tracker_${fromDate}_to_${toDate}.csv`;
    downloadCsv(csvContent, filename);
    setDownloadSuccess(`Downloaded ${filename}`);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Export Transactions</h1>
          <p className="page-subtitle">
            Choose a time frame to preview your records and download a CSV file
            formatted for Excel and spreadsheets.
          </p>
        </div>
      </header>

      <section className="export-card" aria-labelledby="timeframe-heading">
        <h2 id="timeframe-heading" className="section-title">
          Time frame
        </h2>

        <div className="preset-chips" role="group" aria-label="Quick date presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              className={`preset-chip${
                activePreset === preset.key ? ' is-active' : ''
              }`}
              onClick={() => handleSelectPreset(preset.key)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="export-dates-row">
          <div className="form-field">
            <label htmlFor="export-from" className="field-label">
              From
            </label>
            <input
              id="export-from"
              type="date"
              className={`text-input${isRangeInvalid ? ' has-error' : ''}`}
              value={fromDate}
              onChange={(event) => handleFromChange(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="export-to" className="field-label">
              To
            </label>
            <input
              id="export-to"
              type="date"
              className={`text-input${isRangeInvalid ? ' has-error' : ''}`}
              value={toDate}
              onChange={(event) => handleToChange(event.target.value)}
            />
          </div>
        </div>

        {isRangeInvalid && (
          <p className="field-error" role="alert">
            The "From" date cannot be after the "To" date.
          </p>
        )}
      </section>

      <section className="export-card" aria-labelledby="preview-summary-heading">
        <div className="section-header">
          <h2 id="preview-summary-heading" className="section-title">
            Preview summary
          </h2>
        </div>

        <div className="export-stats-grid">
          <div className="export-stat">
            <span className="summary-label">Transactions</span>
            <strong className="export-stat-value tabular-nums">
              {matchingTransactions.length}
            </strong>
          </div>
          <div className="export-stat">
            <span className="summary-label">Total Income</span>
            <strong className="export-stat-value tabular-nums">
              {formatCurrency(summary.income)}
            </strong>
          </div>
          <div className="export-stat">
            <span className="summary-label">Total Expenses</span>
            <strong className="export-stat-value tabular-nums">
              {formatCurrency(summary.expenses)}
            </strong>
          </div>
          <div className="export-stat">
            <span className="summary-label">Net</span>
            <strong className="export-stat-value tabular-nums">
              {formatNetCurrency(summary.net)}
            </strong>
          </div>
        </div>

        {matchingTransactions.length === 0 ? (
          <div className="inline-empty">
            <p>
              {isRangeInvalid
                ? 'Fix the date range above to preview matching transactions.'
                : 'No transactions found in the selected date range.'}
            </p>
          </div>
        ) : (
          <div className="export-preview-block">
            <p className="preview-caption">
              First {previewRows.length} of {matchingTransactions.length}{' '}
              {matchingTransactions.length === 1 ? 'row' : 'rows'} (sorted
              chronologically):
            </p>
            <div className="tx-table-wrap export-preview-table-wrap">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Title</th>
                    <th scope="col">Type</th>
                    <th scope="col">Category</th>
                    <th scope="col" className="text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((tx) => (
                    <tr key={tx.id}>
                      <td className="tx-date-cell">
                        {formatDisplayDate(tx.date)}
                      </td>
                      <td className="tx-title-text">{tx.title}</td>
                      <td className="tx-type-cell">{tx.type}</td>
                      <td>
                        <span className="category-pill">{tx.category}</span>
                      </td>
                      <td className="text-right tx-amount-cell tabular-nums">
                        {formatSignedCurrency(tx.amount, tx.type)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="tx-mobile-cards" aria-label="Export preview rows">
              {previewRows.map((tx) => (
                <li key={tx.id} className="tx-mobile-card">
                  <div className="tx-mobile-top">
                    <span className="tx-title-text">{tx.title}</span>
                    <span className="tx-amount-cell tabular-nums">
                      {formatSignedCurrency(tx.amount, tx.type)}
                    </span>
                  </div>
                  <div className="tx-mobile-bottom">
                    <div className="tx-mobile-meta">
                      <span className="category-pill">{tx.category}</span>
                      <span className="tx-date-cell">
                        {formatDisplayDate(tx.date)}
                      </span>
                    </div>
                    <span className="tx-type-cell">{tx.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="export-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={handleDownload}
            disabled={isRangeInvalid || matchingTransactions.length === 0}
          >
            <i className="fa-solid fa-download" aria-hidden="true" />
            <span>Download CSV</span>
          </button>

          {downloadSuccess && (
            <p className="export-success" role="status">
              <i className="fa-solid fa-check" aria-hidden="true" />
              <span>{downloadSuccess}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
