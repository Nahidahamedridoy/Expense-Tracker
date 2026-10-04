# 💰 Expense Tracker

A full-stack expense tracking web application built with **Next.js 16 (App Router)**, **TypeScript**, **Redux Toolkit**, **Mongoose & MongoDB**, **Tailwind CSS**, and **Recharts**.

Designed to deliver seamless transaction management, real-time metrics, dynamic category breakdown visualizations, and intuitive filtering with a clean, modern user experience.

---

## 🔗 Links

- **Live Demo** [(https://expense-tracker-phi-one-47.vercel.app)]
- **GitHub Repository**: [https://github.com/Nahidahamedridoy/Expense-Tracker](https://github.com/Nahidahamedridoy/Expense-Tracker)

---

## ✨ Features Actually Implemented

### 📊 1. Dashboard & Analytics (`/`)
- **Real-Time Financial Metrics**: Instant calculation and display of **Total Expenses ($)** and **Total Transactions** from the Redux store.
- **Interactive Data Visualization**: Visual breakdown of expenses using **Recharts** (`PieChart` donut chart) with tooltips, legends, and category-specific color coding.
- **Visual Category Breakdown**: Progress bar indicator for each expense category (`Food`, `Transport`, `Shopping`, `Others`) showing total spent and percentage distribution.
- **Recent Expenses List**: Fast preview of the 3 most recent transactions with direct navigation to the full list.
- **Quick Actions**: Prominent shortcuts to quickly add a new expense or view all transactions.

### ➕ 2. Expense Creation (`/add-expense`)
- **Add Expense Form**: Dedicated form supporting Title, Amount, Category, and Date.
- **Form Validation**: Strict client-side validation for required fields, positive amount values, and allowed categories.
- **Instant User Feedback**: Success notification banner with automatic redirection to the expense list upon successful creation.

### 📋 3. Expense List & Management (`/expense-list`)
- **Complete Transaction Feed**: Displays all recorded expenses sorted chronologically using reusable card components.
- **Category Badges**: Distinct visual badge styling for each category:
  - 🍕 **Food**: Orange badge
  - 🚗 **Transport**: Blue badge
  - 🛍️ **Shopping**: Purple badge
  - 📦 **Others**: Gray badge
- **Dynamic Filtering**:
  - Filter by category (`All`, `Food`, `Transport`, `Shopping`, `Others`).
  - Filter by date range (`From Date` and `To Date`).
  - "Clear Filters" action to reset all criteria with a single click.
- **Filtered Totals**: Dynamic badge displaying the total amount and count of transactions currently matching the active filter criteria.
- **Inline Editing**: Allows users to edit any transaction directly; clicking "Edit" populates the form at the top of the page with smooth scrolling.
- **Delete with Confirmation**: Deletes transactions via Redux action with browser confirmation safeguard.
- **Empty States**: Friendly UI fallback when no expenses match the filter or when no transactions exist.

### 🎨 4. Design & Navigation
- **Responsive Sticky Navigation**: Top navigation bar with active route indicators across desktop and mobile screen sizes.
- **Clean Light Theme**: Accessible, polished light theme designed with Tailwind CSS, subtle borders, card elevations, and custom Geist typography.
- **Asynchronous Feedback**: Dedicated loading spinners and descriptive error alerts for seamless user experience.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Route Handlers) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **Fonts** | [Geist](https://vercel.com/font) (`next/font/google`) |

---

## 📁 Project Structure

```text
expense-tracker/
├── app/
│   ├── add-expense/
│   │   └── page.tsx              # Add Expense page with form & redirect
│   ├── api/
│   │   └── expenses/
│   │       └── route.ts          # API Route Handler (GET all & POST create)
│   ├── components/
│   │   ├── ExpenseCard.tsx       # Expense card component with edit/delete actions
│   │   ├── ExpenseForm.tsx       # Controlled form component (create & edit)
│   │   ├── ExpenseList.tsx       # List component with empty state handling
│   │   └── Navbar.tsx            # Sticky responsive navigation bar
│   ├── expense-list/
│   │   └── page.tsx              # Filterable list page with date & category filters
│   ├── store/
│   │   ├── expenseSlice.ts       # Redux slice with async thunks (CRUD)
│   │   ├── provider.tsx          # Client-side Redux Provider wrapper
│   │   └── store.ts              # Configured Redux Toolkit store
│   ├── favicon.ico               # Favicon
│   ├── globals.css               # Global CSS & Tailwind styling
│   ├── layout.tsx                # Root layout with Navbar and Redux Provider
│   └── page.tsx                  # Home Dashboard with metrics & Recharts chart
├── lib/
│   └── mongodb.ts                # Mongoose connection utility with global caching
├── models/
│   └── Expense.ts                # Mongoose schema and model definition
├── public/                       # Static public assets
├── .gitignore                    # Git ignore configurations (ignoring .env*)
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and build scripts
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Project documentation
```

---

## 🔄 Redux Toolkit Architecture

State management is centralized using **Redux Toolkit**:

- **Store Configuration (`app/store/store.ts`)**: Configures the global store with the `expenses` reducer and exports typed `RootState` and `AppDispatch` hooks.
- **Provider Wrapper (`app/store/provider.tsx`)**: Client component providing the Redux store to the entire application inside `app/layout.tsx`.
- **Expense Slice (`app/store/expenseSlice.ts`)**:
  - **State Structure**:
    ```typescript
    interface ExpenseState {
      expenses: Expense[];
      loading: boolean;
      error: string | null;
    }
    ```
  - **Async Thunks**:
    - `fetchExpenses()`: Dispatches request to `GET /api/expenses` to synchronize state with MongoDB.
    - `addExpense(data)`: Dispatches request to `POST /api/expenses` and appends the newly created expense.
    - `updateExpense({ id, data })`: Dispatches request to `PUT /api/expenses/${id}` and replaces the modified expense in the store.
    - `deleteExpense(id)`: Dispatches request to `DELETE /api/expenses/${id}` and removes the deleted expense from the store.
  - **Lifecycle Management**: Handles `pending`, `fulfilled`, and `rejected` states for all asynchronous operations with typed error handling.

---

## 🏛️ Next.js API + Mongoose + MongoDB Architecture

1. **Connection Caching (`lib/mongodb.ts`)**:
   - Manages a cached Mongoose connection across Next.js serverless invocations and development hot-reloads using a global singleton pattern (`globalWithMongoose`).
   - Prevents redundant database connections and avoids connection pool exhaustion.
   - Verifies the availability of `MONGODB_URI` environment variable before connection.

2. **Schema & Model Definition (`models/Expense.ts`)**:
   - **Schema Fields**:
     - `title`: `String`, required.
     - `amount`: `Number`, required.
     - `category`: `String`, enum: `['Food', 'Transport', 'Shopping', 'Others']`, required.
     - `date`: `Date`, required.
     - `timestamps`: Automatically manages `createdAt` and `updatedAt`.
   - Prevents model re-compilation during hot-reloads via `mongoose.models.Expense || mongoose.model(...)`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/expenses` | Fetches all expenses sorted by date descending (`-1`) | None | `200 OK` (JSON array of expenses) |
| `POST` | `/api/expenses` | Creates a new expense record in MongoDB | `{ title, amount, category, date }` | `201 Created` (Created expense object) or `400 Bad Request` |
| `PUT` | `/api/expenses/:id` | Updates an existing expense by MongoDB ObjectId | `{ title, amount, category, date }` | `200 OK` (Updated expense) or `400`/`404` |
| `DELETE` | `/api/expenses/:id` | Deletes an expense by MongoDB ObjectId | None | `200 OK` (`{ message }`) or `400`/`404` |

---

## 🗄️ MongoDB Setup

1. **MongoDB Atlas (Cloud Database)**:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Under **Database Access**, create a database user with read/write privileges.
   - Under **Network Access**, add an IP Access entry (`0.0.0.0/0` for development and serverless deployment like Vercel).
   - Click **Connect** → **Drivers** → Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
     ```
2. **Local MongoDB (Alternative)**:
   - Ensure MongoDB is running locally on port 27017:
     ```text
     mongodb://localhost:27017/expense_tracker
     ```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

> ⚠️ **Security Notice**: Never commit `.env.local` or sensitive database credentials to Git. The `.env*` files are ignored by default in `.gitignore`.

---

## 🚀 Local Installation & Run Steps

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm** (or yarn / pnpm)
- Active MongoDB database connection string

### 2. Clone the Repository
```bash
git clone https://github.com/Nahidahamedridoy/Expense-Tracker.git
cd expense-tracker
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create `.env.local` in the project root:
```bash
# Add MONGODB_URI to .env.local
MONGODB_URI=your_mongodb_connection_string
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Build & Type-Check Commands

Run the following scripts from the project root:

```bash
# Type check TypeScript without emitting files
npx tsc --noEmit

# Run ESLint to verify code quality
npm run lint

# Build the production bundle
npm run build

# Start the production server
npm run start
```

---

## ☁️ Vercel Deployment Steps

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Complete Expense Tracker project"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **"Add New..."** → **"Project"**.
3. Import your **`Expense-Tracker`** repository.
4. Under **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
5. In **Environment Variables**, add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection URI (ensure database user password is correct).
6. In MongoDB Atlas, verify **Network Access** includes `0.0.0.0/0` (Allow Access from Anywhere) so Vercel serverless functions can connect.
7. Click **Deploy**. Vercel will build the project and provide a production URL.

---

## 👤 Author

**Nahid Ahamed Ridoy**
- **GitHub**: [@Nahidahamedridoy](https://github.com/Nahidahamedridoy)
