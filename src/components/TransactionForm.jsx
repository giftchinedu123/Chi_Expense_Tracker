import { useEffect, useRef, useState } from 'react';
import { getCategoriesForType } from '../utils/constants';
import { getTodayString } from '../utils/dates';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function TransactionForm({
  isOpen,
  initialTransaction,
  onSubmit,
  onClose,
}) {
  const isEditing = Boolean(initialTransaction);
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayString());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialTransaction) {
      setTitle(initialTransaction.title || '');
      setAmount(String(initialTransaction.amount ?? ''));
      setType(initialTransaction.type || 'expense');
      setCategory(initialTransaction.category || 'Food');
      setDate(initialTransaction.date || getTodayString());
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('Food');
      setDate(getTodayString());
    }
    setErrors({});
  }, [isOpen, initialTransaction]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const availableCategories = getCategoriesForType(type);

  const handleTypeChange = (nextType) => {
    setType(nextType);
    const nextCategories = getCategoriesForType(nextType);
    if (!nextCategories.includes(category)) {
      setCategory(nextCategories[0]);
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) {
      nextErrors.title = 'Please enter a title.';
    }
    const numericAmount = Number(amount);
    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than 0.';
    }
    if (!date) {
      nextErrors.date = 'Please select a date.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...(initialTransaction ? { id: initialTransaction.id } : {}),
      title: title.trim(),
      amount: Number(Number(amount).toFixed(2)),
      type,
      category,
      date,
    });
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
      >
        <div className="modal-header">
          <h2 id="transaction-modal-title" className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            type="button"
            className="icon-circle-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <span className="field-label">Type</span>
            <div className="segmented-control" role="group" aria-label="Transaction type">
              <button
                type="button"
                className={`segment-btn${type === 'expense' ? ' is-active' : ''}`}
                aria-pressed={type === 'expense'}
                onClick={() => handleTypeChange('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`segment-btn${type === 'income' ? ' is-active' : ''}`}
                aria-pressed={type === 'income'}
                onClick={() => handleTypeChange('income')}
              >
                Income
              </button>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="tx-title" className="field-label">
              Title
            </label>
            <input
              ref={titleInputRef}
              id="tx-title"
              type="text"
              className={`text-input${errors.title ? ' has-error' : ''}`}
              placeholder={
                type === 'income' ? 'e.g. Monthly Salary' : 'e.g. Groceries'
              }
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'tx-title-error' : undefined}
            />
            {errors.title && (
              <p id="tx-title-error" className="field-error">
                {errors.title}
              </p>
            )}
          </div>

          <div className="form-row-two">
            <div className="form-field">
              <label htmlFor="tx-amount" className="field-label">
                Amount (₦)
              </label>
              <input
                id="tx-amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                className={`text-input tabular-nums${
                  errors.amount ? ' has-error' : ''
                }`}
                placeholder="0.00"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: '' }));
                  }
                }}
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? 'tx-amount-error' : undefined}
              />
              {errors.amount && (
                <p id="tx-amount-error" className="field-error">
                  {errors.amount}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="tx-category" className="field-label">
                Category
              </label>
              <select
                id="tx-category"
                className="select-input"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="tx-date" className="field-label">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              className={`text-input${errors.date ? ' has-error' : ''}`}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                if (errors.date) {
                  setErrors((prev) => ({ ...prev, date: '' }));
                }
              }}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? 'tx-date-error' : undefined}
            />
            {errors.date && (
              <p id="tx-date-error" className="field-error">
                {errors.date}
              </p>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
