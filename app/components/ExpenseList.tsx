'use client';
import { Expense } from '../store/expenseSlice';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onEdit }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No expenses found</h3>
        <p className="text-gray-500 mt-1">Get started by adding a new expense.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {expenses.map((expense) => (
        <ExpenseCard key={expense._id} expense={expense} onEdit={onEdit} />
      ))}
    </div>
  );
}
