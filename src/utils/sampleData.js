import { toDateString } from './dates';

export function createTransactionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function generateSampleTransactions() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDay = now.getDate();

  const clampCurrentDay = (desiredDay) => {
    const safeDay = Math.max(1, Math.min(desiredDay, todayDay));
    return toDateString(new Date(currentYear, currentMonth, safeDay));
  };

  const prevMonthDate = (desiredDay) => {
    const prevBase = new Date(currentYear, currentMonth - 1, 1);
    const maxDay = new Date(
      prevBase.getFullYear(),
      prevBase.getMonth() + 1,
      0
    ).getDate();
    const safeDay = Math.max(1, Math.min(desiredDay, maxDay));
    return toDateString(
      new Date(prevBase.getFullYear(), prevBase.getMonth(), safeDay)
    );
  };

  const items = [

    {
      title: 'Monthly Salary',
      amount: 450000,
      type: 'income',
      category: 'Salary',
      date: clampCurrentDay(1),
    },
    {
      title: 'Market Groceries & Foodstuff',
      amount: 38500,
      type: 'expense',
      category: 'Food',
      date: clampCurrentDay(2),
    },
    {
      title: 'IKEDC Electricity Token',
      amount: 24000,
      type: 'expense',
      category: 'Bills',
      date: clampCurrentDay(4),
    },
    {
      title: 'MTN Fiber & Mobile Data',
      amount: 16500,
      type: 'expense',
      category: 'Bills',
      date: clampCurrentDay(6),
    },
    {
      title: 'Freelance UI Design Project',
      amount: 125000,
      type: 'income',
      category: 'Business',
      date: clampCurrentDay(8),
    },
    {
      title: 'Bolt & Commute Fares',
      amount: 14200,
      type: 'expense',
      category: 'Transport',
      date: clampCurrentDay(10),
    },
    {
      title: 'Pharmacy & Routine Checkup',
      amount: 18500,
      type: 'expense',
      category: 'Health',
      date: clampCurrentDay(12),
    },
    {
      title: 'Lunch & Supermarket Run',
      amount: 21400,
      type: 'expense',
      category: 'Food',
      date: clampCurrentDay(15),
    },
    {
      title: 'Weekend Cinema & Streaming',
      amount: 11500,
      type: 'expense',
      category: 'Entertainment',
      date: clampCurrentDay(17),
    },

    // Previous month transactions
    {
      title: 'Monthly Salary',
      amount: 450000,
      type: 'income',
      category: 'Salary',
      date: prevMonthDate(1),
    },
    {
      title: 'Apartment Rent Contribution',
      amount: 165000,
      type: 'expense',
      category: 'Bills',
      date: prevMonthDate(3),
    },
    {
      title: 'Shoprite Provisions & Produce',
      amount: 46800,
      type: 'expense',
      category: 'Food',
      date: prevMonthDate(7),
    },
    {
      title: 'Online Course Subscription',
      amount: 28000,
      type: 'expense',
      category: 'Education',
      date: prevMonthDate(11),
    },
    {
      title: 'Fuel & Ride-Hailing',
      amount: 23500,
      type: 'expense',
      category: 'Transport',
      date: prevMonthDate(16),
    },
    {
      title: 'Work Shirts & Accessories',
      amount: 34000,
      type: 'expense',
      category: 'Shopping',
      date: prevMonthDate(21),
    },
    {
      title: 'Family Cash Gift',
      amount: 40000,
      type: 'income',
      category: 'Gift',
      date: prevMonthDate(25),
    },
  ];

  const baseTimestamp = Date.now();
  return items.map((item, index) => ({
    id: createTransactionId(),
    ...item,
    createdAt: baseTimestamp - (items.length - index) * 1000,
  }));
}
