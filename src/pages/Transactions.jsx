import { useMemo, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useDebounce } from '../hooks/useDebounce';
import { useTransactions } from '../hooks/useTransactions';
import { formatNetCurrency } from '../utils/formatCurrency';

export default function Transactions() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
  } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [txToDelete, setTxToDelete] = useState(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    fromDate !== '' ||
    toDate !== '';

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setFromDate('');
    setToDate('');
  };

  const filteredTransactions = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return transactions
      .filter((tx) => {
        if (query && !tx.title.toLowerCase().includes(query)) {
          return false;
        }
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
          return false;
        }
        if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
          return false;
        }
        if (fromDate && tx.date < fromDate) {
          return false;
        }
        if (toDate && tx.date > toDate) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateOrder = b.date.localeCompare(a.date);
        if (dateOrder !== 0) return dateOrder;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [
    transactions,
    debouncedSearch,
    typeFilter,
    categoryFilter,
    fromDate,
    toDate,
  ]);

  const filteredNet = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => {
      return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
    }, 0);
  }, [filteredTransactions]);

  const handleOpenAdd = () => {
    setEditingTx(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTx(tx);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingTx) {
      updateTransaction(data);
    } else {
      addTransaction(data);
    }
    setIsFormOpen(false);
    setEditingTx(null);
  };

  const handleConfirmDelete = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  const handleConfirmClearAll = () => {
    clearAll();
    setIsClearAllOpen(false);
    resetFilters();
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">
            Search, filter, edit, or add your income and expense entries.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary desktop-add-btn"
          onClick={handleOpenAdd}
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          <span>Add Transaction</span>
        </button>
      </header>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {transactions.length > 0 && (
        <div className="results-summary" aria-live="polite">
          <span className="results-count">
            {filteredTransactions.length}{' '}
            {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
          </span>
          <span className="results-net tabular-nums">
            Net: <strong>{formatNetCurrency(filteredNet)}</strong>
          </span>
        </div>
      )}

      {transactions.length === 0 ? (
        <EmptyState
          iconClass="fa-solid fa-receipt"
          title="No transactions yet"
          message="Add your first income or expense transaction to start building your ledger."
          primaryAction={{
            label: 'Add Transaction',
            onClick: handleOpenAdd,
          }}
        />
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          iconClass="fa-solid fa-filter"
          title="No results match your filters"
          message="Try adjusting your search query, category, or date range."
          primaryAction={{
            label: 'Reset filters',
            onClick: resetFilters,
          }}
        />
      ) : (
        <>
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleOpenEdit}
            onDelete={setTxToDelete}
          />

          <div className="danger-footer">
            <button
              type="button"
              className="text-button-muted"
              onClick={() => setIsClearAllOpen(true)}
            >
              Clear all data
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        className="btn-primary mobile-fab-btn"
        onClick={handleOpenAdd}
        aria-label="Add Transaction"
      >
        <i className="fa-solid fa-plus" aria-hidden="true" />
        <span>Add Transaction</span>
      </button>

      <TransactionForm
        isOpen={isFormOpen}
        initialTransaction={editingTx}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTx(null);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        title="Delete Transaction"
        message={
          txToDelete
            ? `Are you sure you want to delete "${txToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTxToDelete(null)}
      />

      <ConfirmDialog
        isOpen={isClearAllOpen}
        title="Clear All Data"
        message="This will permanently remove all saved transactions from this browser. Are you sure you want to continue?"
        confirmLabel="Clear all"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearAllOpen(false)}
      />
    </div>
  );
}
