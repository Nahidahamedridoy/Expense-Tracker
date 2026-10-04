'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { addExpense, updateExpense, Expense } from '../store/expenseSlice';

interface ExpenseFormProps {
  expenseToEdit: Expense | null;
  onClearEdit: () => void;
}

export default function ExpenseForm({ expenseToEdit, onClearEdit }: ExpenseFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.expenses.loading);

  let initialDate = '';
  if (expenseToEdit) {
    const d = new Date(expenseToEdit.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    initialDate = `${year}-${month}-${day}`;
  }

  const [title, setTitle] = useState(expenseToEdit?.title || '');
  const [amount, setAmount] = useState(expenseToEdit?.amount.toString() || '');
  const [category, setCategory] = useState<'Food' | 'Transport' | 'Shopping' | 'Others'>(
    expenseToEdit?.category || 'Food'
  );
  const [date, setDate] = useState(initialDate);
  const [error, setError] = useState('');

  const handleCancel = () => {
    if (expenseToEdit) {
      onClearEdit();
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate('');
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      return setError('Title is required');
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return setError('Amount must be greater than 0');
    }
    if (!category) {
      return setError('Category is required');
    }
    if (!date) {
      return setError('Date is required');
    }

    const expenseData = {
      title,
      amount: numAmount,
      category,
      date: new Date(date).toISOString(),
    };

    try {
      if (expenseToEdit) {
        await dispatch(updateExpense({ id: expenseToEdit._id, data: expenseData })).unwrap();
        onClearEdit(); // This unmounts the current form by changing the key in the parent
      } else {
        await dispatch(addExpense(expenseData)).unwrap();
        setTitle('');
        setAmount('');
        setCategory('Food');
        setDate('');
        setError('');
      }
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : (err as Error).message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-black"
            placeholder="e.g. Groceries"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-black"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'Food' | 'Transport' | 'Shopping' | 'Others')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-black"
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-black"
          />
        </div>

        <div className="flex gap-3 pt-2 mt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : expenseToEdit ? 'Update' : 'Add Expense'}
          </button>
          
          {(expenseToEdit || title || amount || date) && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
