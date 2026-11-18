import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  TRANSACTION_ACTIONS,
  loadInitialTransactions,
  transactionReducer,
} from '../reducers/transactionReducer';
import { STORAGE_KEY } from '../utils/constants';

export const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, dispatch] = useReducer(
    transactionReducer,
    undefined,
    loadInitialTransactions
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
    
    }
  }, [transactions]);

  const addTransaction = useCallback((data) => {
    dispatch({ type: TRANSACTION_ACTIONS.ADD_TRANSACTION, payload: data });
  }, []);

  const updateTransaction = useCallback((data) => {
    dispatch({ type: TRANSACTION_ACTIONS.UPDATE_TRANSACTION, payload: data });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: TRANSACTION_ACTIONS.DELETE_TRANSACTION, payload: id });
  }, []);

  const loadSampleData = useCallback(() => {
    dispatch({ type: TRANSACTION_ACTIONS.LOAD_SAMPLE_DATA });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: TRANSACTION_ACTIONS.CLEAR_ALL });
  }, []);

  const allTimeBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
    }, 0);
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      allTimeBalance,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      loadSampleData,
      clearAll,
    }),
    [
      transactions,
      allTimeBalance,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      loadSampleData,
      clearAll,
    ]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
