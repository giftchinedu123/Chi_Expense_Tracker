import { useMemo, useState } from 'react';
import CategoryTiles from '../components/CategoryTiles';
import EmptyState from '../components/EmptyState';
import ExpenseChart from '../components/ExpenseChart';
import MonthNavigator from '../components/MonthNavigator';
import RecentPayments from '../components/RecentPayments';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import { useTransactions } from '../hooks/useTransactions';
import {
  formatDisplayDate,
  formatMonthLabel,
  getDaysInMonth,
  getMonthKey,
  toDateString,
  toMonthKey,
} from '../utils/dates';

export default function Dashboard() {
  const { transactions, allTimeBalance, addTransaction, loadSampleData } =
    useTransactions();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isCurrentMonth =
    selectedYear === currentYear && selectedMonth === currentMonth;

  const monthLabel = formatMonthLabel(selectedYear, selectedMonth);
  const selectedMonthKey = toMonthKey(selectedYear, selectedMonth);

  const handlePrevMonth = () => {
    const prev = new Date(selectedYear, selectedMonth - 1, 1);
    setSelectedYear(prev.getFullYear());
    setSelectedMonth(prev.getMonth());
  };

  const handleNextMonth = () => {
    if (isCurrentMonth) return;
    const next = new Date(selectedYear, selectedMonth + 1, 1);
    setSelectedYear(next.getFullYear());
    setSelectedMonth(next.getMonth());
  };

  const handleToday = () => {
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  };

  const monthTransactions = useMemo(() => {
    return transactions
      .filter((tx) => getMonthKey(tx.date) === selectedMonthKey)
      .sort((a, b) => {
        const dateOrder = b.date.localeCompare(a.date);
        if (dateOrder !== 0) return dateOrder;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [transactions, selectedMonthKey]);

  const { monthlyIncome, monthlyExpenses } = useMemo(() => {
    return monthTransactions.reduce(
      (totals, tx) => {
        if (tx.type === 'income') {
          totals.monthlyIncome += tx.amount;
        } else {
          totals.monthlyExpenses += tx.amount;
        }
        return totals;
      },
      { monthlyIncome: 0, monthlyExpenses: 0 }
    );
  }, [monthTransactions]);

  const recentFive = useMemo(() => {
    return monthTransactions.slice(0, 5);
  }, [monthTransactions]);

  const dailyChartData = useMemo(() => {
    const daysCount = getDaysInMonth(selectedYear, selectedMonth);
    const dailyTotals = monthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        const dayNum = Number(tx.date.slice(8, 10));
        acc[dayNum] = (acc[dayNum] || 0) + tx.amount;
        return acc;
      }, {});

    return Array.from({ length: daysCount }, (_, index) => {
      const day = index + 1;
      const dateStr = toDateString(
        new Date(selectedYear, selectedMonth, day)
      );
      return {
        day,
        fullDate: formatDisplayDate(dateStr),
        total: dailyTotals[day] || 0,
      };
    });
  }, [monthTransactions, selectedYear, selectedMonth]);

  const categoryTotals = useMemo(() => {
    const grouped = monthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [monthTransactions]);

  const handleCreateTransaction = (data) => {
    addTransaction(data);
    setIsAddModalOpen(false);
  };

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <h1 className="hero-title">
          <span className="hero-word-dark">Expense</span>{' '}
          <span className="hero-word-light">Tracker</span>
        </h1>

        <button
          type="button"
          className="btn-primary desktop-add-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          <span>Add Transaction</span>
        </button>
      </header>

      {transactions.length === 0 ? (
        <EmptyState
          iconClass="fa-solid fa-receipt"
          title="Welcome to Expense Tracker"
          message="You haven't recorded any transactions yet. Add your first income or expense in Naira, or load realistic sample data to explore the dashboard."
          primaryAction={{
            label: 'Add your first transaction',
            onClick: () => setIsAddModalOpen(true),
          }}
          secondaryAction={{
            label: 'Load sample data',
            onClick: loadSampleData,
          }}
        />
      ) : (
        <>
          <MonthNavigator
            year={selectedYear}
            monthIndex={selectedMonth}
            isCurrentMonth={isCurrentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />

          <div className="dashboard-grid">
            <div className="dashboard-col">
              <SummaryCards
                balance={allTimeBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                monthLabel={monthLabel}
              />
              <RecentPayments
                transactions={recentFive}
                monthLabel={monthLabel}
              />
            </div>

            <div className="dashboard-col">
              <ExpenseChart
                data={dailyChartData}
                hasExpenses={monthlyExpenses > 0}
                monthLabel={monthLabel}
              />
              <CategoryTiles
                categories={categoryTotals}
                monthLabel={monthLabel}
              />
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        className="btn-primary mobile-fab-btn"
        onClick={() => setIsAddModalOpen(true)}
        aria-label="Add Transaction"
      >
        <i className="fa-solid fa-plus" aria-hidden="true" />
        <span>Add Transaction</span>
      </button>

      <TransactionForm
        isOpen={isAddModalOpen}
        initialTransaction={null}
        onSubmit={handleCreateTransaction}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
