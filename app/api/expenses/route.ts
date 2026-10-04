import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET() {
  try {
    await connectToDatabase();
    const expenses = await Expense.find({}).sort({ date: -1 });
    return NextResponse.json(expenses);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { title, amount, category, date } = body;

    // Validate required fields
    if (!title || amount === undefined || !category || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['Food', 'Transport', 'Shopping', 'Others'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
