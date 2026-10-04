'use client';
import { useDispatch } from 'react-redux';
import { Expense, deleteExpense } from '../store/expenseSlice';
import { AppDispatch } from '../store/store';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseCard({ expense, onEdit }: ExpenseCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(expense._id));
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Transport': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shopping': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-gray-900 text-lg">{expense.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
            {expense.category}
          </span>
          <span>&bull;</span>
          <span>{new Date(expense.date).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
        <div className="text-xl font-bold text-gray-900">${expense.amount.toFixed(2)}</div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
