import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Others';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the expense'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
    },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Shopping', 'Others'],
      required: [true, 'Please provide a category'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in Next.js development
const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
