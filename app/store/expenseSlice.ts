import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Others';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk<Expense[]>(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return await response.json();
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addExpense = createAsyncThunk<
  Expense,
  Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>
>('expenses/addExpense', async (expenseData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to add expense');
    return await response.json();
  } catch (error: unknown) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateExpense = createAsyncThunk<
  Expense,
  { id: string; data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'> }
>('expenses/updateExpense', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return await response.json();
  } catch (error: unknown) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      return id;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExpenses.fulfilled,
        (state, action: PayloadAction<Expense[]>) => {
          state.loading = false;
          state.expenses = action.payload;
        }
      )
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Expense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateExpense.fulfilled,
        (state, action: PayloadAction<Expense>) => {
          state.loading = false;
          const index = state.expenses.findIndex(
            (e) => e._id === action.payload._id
          );
          if (index !== -1) {
            state.expenses[index] = action.payload;
          }
        }
      )
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Expense
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteExpense.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.expenses = state.expenses.filter(
            (e) => e._id !== action.payload
          );
        }
      )
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default expenseSlice.reducer;
