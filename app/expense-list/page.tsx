'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchExpenses, Expense } from '../store/expenseSlice';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';

export default function ExpenseListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading, error } = useSelector((state: RootState) => state.expenses);

  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchExpenses()).then(() => setInitialFetchDone(true));
  }, [dispatch]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCategory !== 'All' && e.category !== filterCategory) return false;
      
      if (startDate || endDate) {
        const expDate = new Date(e.date).getTime();
        if (startDate) {
          const s = new Date(startDate).getTime();
          if (expDate < s) return false;
        }
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (expDate > eDate.getTime()) return false;
        }
      }
      return true;
    });
  }, [expenses, filterCategory, startDate, endDate]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const handleClearFilters = () => {
    setFilterCategory('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {expenseToEdit ? (
        <div className="mb-8">
          <ExpenseForm 
            key={expenseToEdit._id}
            expenseToEdit={expenseToEdit} 
            onClearEdit={() => setExpenseToEdit(null)} 
          />
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense List</h1>
          <p className="text-gray-600 mt-1">Manage and filter your transactions.</p>
        </div>
        
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-4 shadow-sm">
          <div>
            <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Filtered Total</div>
            <div className="text-lg font-bold">${totalAmount.toFixed(2)}</div>
          </div>
          <div className="w-px h-8 bg-blue-200"></div>
          <div>
            <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Transactions</div>
            <div className="text-lg font-bold">{filteredExpenses.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm border border-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md border border-red-200 shadow-sm">
          Error fetching expenses: {error}
        </div>
      )}

      {loading && !initialFetchDone ? (
        <div className="flex justify-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <ExpenseList 
          expenses={filteredExpenses} 
          onEdit={(expense) => {
            setExpenseToEdit(expense);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      )}
    </main>
  );
}
