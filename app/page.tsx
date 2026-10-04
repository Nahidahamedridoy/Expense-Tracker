'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { fetchExpenses } from './store/expenseSlice';
import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading, error } = useSelector((state: RootState) => state.expenses);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    dispatch(fetchExpenses()).then(() => setInitialFetchDone(true));
  }, [dispatch]);

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {
      Food: 0,
      Transport: 0,
      Shopping: 0,
      Others: 0,
    };
    expenses.forEach((exp) => {
      if (categories[exp.category] !== undefined) {
        categories[exp.category] += exp.amount;
      } else {
        categories['Others'] += exp.amount;
      }
    });

    return [
      { name: 'Food', value: categories.Food, color: '#f97316' }, // orange-500
      { name: 'Transport', value: categories.Transport, color: '#3b82f6' }, // blue-500
      { name: 'Shopping', value: categories.Shopping, color: '#a855f7' }, // purple-500
      { name: 'Others', value: categories.Others, color: '#6b7280' }, // gray-500
    ].filter((item) => item.value > 0);
  }, [expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  }, [expenses]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your Expense Tracker</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/expense-list"
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            View All Expenses
          </Link>
          <Link
            href="/add-expense"
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
          >
            + Add New Expense
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <p className="text-sm text-red-700 font-medium">Error fetching expenses: {error}</p>
        </div>
      )}

      {loading && !initialFetchDone ? (
        <div className="flex justify-center p-10 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Expenses</p>
                <p className="text-4xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Transactions</p>
                <p className="text-4xl font-bold text-gray-900">{expenses.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-[400px]">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h2>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                  No data to display
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Category Breakdown</h2>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Food', color: 'bg-orange-500' },
                  { name: 'Transport', color: 'bg-blue-500' },
                  { name: 'Shopping', color: 'bg-purple-500' },
                  { name: 'Others', color: 'bg-gray-500' },
                ].map((cat) => {
                  const data = categoryData.find((d) => d.name === cat.name);
                  const val = data ? data.value : 0;
                  const percent = totalAmount > 0 ? (val / totalAmount) * 100 : 0;
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        <span className="font-semibold text-gray-900">${val.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${cat.color} h-2 rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
              {recentExpenses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{expense.title}</p>
                        <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">${expense.amount.toFixed(2)}</p>
                    </div>
                  ))}
                  <Link
                    href="/expense-list"
                    className="text-center text-sm text-blue-600 font-medium hover:text-blue-800 mt-2 transition-colors"
                  >
                    View all transactions &rarr;
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg border border-gray-100">No recent expenses.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
