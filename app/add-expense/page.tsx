'use client';
import { useRouter } from 'next/navigation';
import ExpenseForm from '../components/ExpenseForm';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchExpenses } from '../store/expenseSlice';

export default function AddExpensePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    // Optionally pre-fetch so state is fresh when going to list
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleSuccess = () => {
    setSuccessMsg(true);
    setTimeout(() => {
      router.push('/expense-list');
    }, 1000);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
        <p className="text-gray-600 mt-1">Record a new transaction to track your spending.</p>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-sm">
          <p className="font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Expense added successfully! Redirecting...
          </p>
        </div>
      )}

      <ExpenseForm
        key="new"
        expenseToEdit={null}
        onClearEdit={handleSuccess}
      />
    </main>
  );
}
