import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Expense, Income, SavingsGoal, Subscription } from '../lib/database.types';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0d9488', '#f97316', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.expense_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const thisMonthIncome = income.filter((i) => {
    const date = new Date(i.income_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalExpensesThisMonth = thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncomeThisMonth = thisMonthIncome.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalSavings = savingsGoals.reduce((sum, s) => sum + Number(s.current_amount), 0);
  const monthlySubscriptions = subscriptions
    .filter((s) => s.is_active)
    .reduce((sum, s) => {
      if (s.frequency === 'monthly') return sum + Number(s.amount);
      if (s.frequency === 'yearly') return sum + Number(s.amount) / 12;
      if (s.frequency === 'weekly') return sum + Number(s.amount) * 4;
      return sum + Number(s.amount) / 3;
    }, 0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);

    const [expensesRes, incomeRes, savingsRes, subsRes] = await Promise.all([
      supabase
        .from('expenses')
        .select('*')
        .eq('is_deleted', false)
        .order('expense_date', { ascending: false })
        .limit(100),
      supabase
        .from('income')
        .select('*')
        .eq('is_deleted', false)
        .order('income_date', { ascending: false })
        .limit(50),
      supabase.from('savings_goals').select('*').eq('is_deleted', false),
      supabase.from('subscriptions').select('*').eq('is_deleted', false),
    ]);

    if (expensesRes.data) setExpenses(expensesRes.data);
    if (incomeRes.data) setIncome(incomeRes.data);
    if (savingsRes.data) setSavingsGoals(savingsRes.data);
    if (subsRes.data) setSubscriptions(subsRes.data);

    setLoading(false);
  }

  const categoryData = thisMonthExpenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData)
    .map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const lastSixMonthsData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthExpenses = expenses.filter((e) => {
      const expDate = new Date(e.expense_date);
      return expDate.getMonth() === month && expDate.getFullYear() === year;
    });

    const monthIncome = income.filter((i) => {
      const incDate = new Date(i.income_date);
      return incDate.getMonth() === month && incDate.getFullYear() === year;
    });

    lastSixMonthsData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      expenses: monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
      income: monthIncome.reduce((sum, i) => sum + Number(i.amount), 0),
    });
  }

  const balance = totalIncomeThisMonth - totalExpensesThisMonth;
  const recentTransactions = [...thisMonthExpenses.slice(0, 5), ...thisMonthIncome.slice(0, 3)]
    .sort((a, b) => {
      const dateA = new Date('expense_date' in a ? a.expense_date : a.income_date);
      const dateB = new Date('expense_date' in b ? b.expense_date : b.income_date);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalExpensesThisMonth.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Expenses</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalIncomeThisMonth.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Income</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-lg ${
                balance >= 0
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              {balance >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Net Balance</span>
          </div>
          <p
            className={`text-2xl font-bold ${
              balance >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            ${Math.abs(balance).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {balance >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <PiggyBank className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalSavings.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Savings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Income vs Expenses (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lastSixMonthsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Spending Categories
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expenses this month
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction, idx) => {
                const isExpense = 'category' in transaction;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isExpense
                            ? 'bg-teal-100 dark:bg-teal-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        {isExpense ? (
                          <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {isExpense
                            ? transaction.category.replace('_', ' ')
                            : transaction.source}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            isExpense ? transaction.expense_date : transaction.income_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isExpense
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}${Number(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No transactions yet
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Subscriptions
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ${monthlySubscriptions.toFixed(2)}/mo
            </span>
          </div>
          {subscriptions.filter((s) => s.is_active).length > 0 ? (
            <div className="space-y-3">
              {subscriptions
                .filter((s) => s.is_active)
                .slice(0, 5)
                .map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {sub.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sub.frequency} • Due: {new Date(sub.next_due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${Number(sub.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No active subscriptions
            </div>
          )}
        </div>
      </div>

      {savingsGoals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Savings Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsGoals.slice(0, 3).map((goal) => {
              const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
              return (
                <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{goal.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>${Number(goal.current_amount).toFixed(2)}</span>
                    <span>${Number(goal.target_amount).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
