import { STORAGE_KEY } from '../utils/constants';
import { createTransactionId, generateSampleTransactions } from '../utils/sampleData';

export const TRANSACTION_ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  LOAD_SAMPLE_DATA: 'LOAD_SAMPLE_DATA',
  CLEAR_ALL: 'CLEAR_ALL',
};

function isValidTransaction(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.amount === 'number' &&
    Number.isFinite(item.amount) &&
    item.amount > 0 &&
    (item.type === 'income' || item.type === 'expense') &&
    typeof item.category === 'string' &&
    typeof item.date === 'string'
  );
}

export function loadInitialTransactions() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTransaction);
  } catch {
    return [];
  }
}

export function transactionReducer(state, action) {
  switch (action.type) {
    case TRANSACTION_ACTIONS.ADD_TRANSACTION: {
      const payload = action.payload;
      const newTransaction = {
        id: createTransactionId(),
        title: String(payload.title).trim(),
        amount: Number(payload.amount),
        type: payload.type,
        category: payload.category,
        date: payload.date,
        createdAt: Date.now(),
      };
      return [newTransaction, ...state];
    }

    case TRANSACTION_ACTIONS.UPDATE_TRANSACTION: {
      const payload = action.payload;
      return state.map((tx) =>
        tx.id === payload.id
          ? {
              ...tx,
              title: String(payload.title).trim(),
              amount: Number(payload.amount),
              type: payload.type,
              category: payload.category,
              date: payload.date,
            }
          : tx
      );
    }

    case TRANSACTION_ACTIONS.DELETE_TRANSACTION: {
      return state.filter((tx) => tx.id !== action.payload);
    }

    case TRANSACTION_ACTIONS.LOAD_SAMPLE_DATA: {
      return generateSampleTransactions();
    }

    case TRANSACTION_ACTIONS.CLEAR_ALL: {
      return [];
    }

    default:
      return state;
  }
}
