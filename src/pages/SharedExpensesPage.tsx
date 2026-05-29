import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Roommate, SharedExpense } from '../lib/database.types';
import { Plus, Users, Trash2, Edit2, Check, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PAYMENT_MODES } from '../lib/constants';

export function SharedExpensesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>([]);
  const [showRoommateForm, setShowRoommateForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [roommateForm, setRoommateForm] = useState({
    name: '',
    phone: '',
    room_number: '',
    notes: '',
  });
  const [expenseForm, setExpenseForm] = useState({
    roommate_id: '',
    description: '',
    total_amount: '',
    paid_by_user: true,
    split_type: 'equal',
    your_share: '',
    their_share: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (expenseForm.split_type === 'equal' && expenseForm.total_amount) {
      const total = parseFloat(expenseForm.total_amount);
      const share = (total / 2).toFixed(2);
      setExpenseForm((prev) => ({
        ...prev,
        your_share: share,
        their_share: share,
      }));
    }
  }, [expenseForm.split_type, expenseForm.total_amount]);

  async function fetchData() {
    setLoading(true);
    const [roommatesRes, expensesRes] = await Promise.all([
      supabase.from('roommates').select('*').eq('is_deleted', false),
      supabase.from('shared_expenses').select('*').eq('is_deleted', false).order('expense_date', { ascending: false }),
    ]);
    if (roommatesRes.data) setRoommates(roommatesRes.data);
    if (expensesRes.data) setSharedExpenses(expensesRes.data);
    setLoading(false);
  }

  async function handleRoommateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    await supabase.from('roommates').insert({
      user_id: user.id,
      name: roommateForm.name,
      phone: roommateForm.phone || null,
      room_number: roommateForm.room_number || null,
      notes: roommateForm.notes || null,
    });

    setRoommateForm({ name: '', phone: '', room_number: '', notes: '' });
    setShowRoommateForm(false);
    fetchData();
  }

  async function handleExpenseSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    await supabase.from('shared_expenses').insert({
      user_id: user.id,
      roommate_id: expenseForm.roommate_id || null,
      description: expenseForm.description,
      total_amount: parseFloat(expenseForm.total_amount),
      paid_by_user: expenseForm.paid_by_user,
      split_type: expenseForm.split_type,
      your_share: parseFloat(expenseForm.your_share),
      their_share: parseFloat(expenseForm.their_share),
      expense_date: expenseForm.expense_date,
    });

    setExpenseForm({
      roommate_id: '',
      description: '',
      total_amount: '',
      paid_by_user: true,
      split_type: 'equal',
      your_share: '',
      their_share: '',
      expense_date: new Date().toISOString().split('T')[0],
    });
    setShowExpenseForm(false);
    fetchData();
  }

  async function deleteRoommate(id: string) {
    if (!confirm('Delete this roommate?')) return;
    await supabase.from('roommates').update({ is_deleted: true }).eq('id', id);
    fetchData();
  }

  async function deleteExpense(id: string) {
    if (!confirm('Delete this shared expense?')) return;
    await supabase.from('shared_expenses').update({ is_deleted: true }).eq('id', id);
    fetchData();
  }

  async function settleExpense(id: string) {
    await supabase
      .from('shared_expenses')
      .update({ is_settled: true, settled_date: new Date().toISOString().split('T')[0] })
      .eq('id', id);
    fetchData();
  }

  const balances = roommates.map((r) => {
    const roommateExpenses = sharedExpenses.filter(
      (e) => e.roommate_id === r.id && !e.is_settled
    );
    const youOwe = roommateExpenses
      .filter((e) => !e.paid_by_user)
      .reduce((sum, e) => sum + Number(e.your_share), 0);
    const theyOwe = roommateExpenses
      .filter((e) => e.paid_by_user)
      .reduce((sum, e) => sum + Number(e.their_share), 0);
    return { ...r, youOwe, theyOwe, net: theyOwe - youOwe };
  });

  const totalYouOwe = balances.reduce((sum, b) => sum + b.youOwe, 0);
  const totalTheyOwe = balances.reduce((sum, b) => sum + b.theyOwe, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shared Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track expenses with roommates and split bills
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRoommateForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Add Roommate
          </button>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpRight className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">You Owe</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ₹{totalYouOwe.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowDownRight className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">They Owe You</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{totalTheyOwe.toFixed(2)}
          </p>
        </div>
      </div>

      {showRoommateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Roommate</h2>
            <button onClick={() => setShowRoommateForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleRoommateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={roommateForm.name}
                  onChange={(e) => setRoommateForm({ ...roommateForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={roommateForm.phone}
                  onChange={(e) => setRoommateForm({ ...roommateForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRoommateForm(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
                Add Roommate
              </button>
            </div>
          </form>
        </div>
      )}

      {showExpenseForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Shared Expense</h2>
            <button onClick={() => setShowExpenseForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Roommate</label>
                <select
                  value={expenseForm.roommate_id}
                  onChange={(e) => setExpenseForm({ ...expenseForm, roommate_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                >
                  <option value="">Select roommate</option>
                  {roommates.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.total_amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, total_amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paid By</label>
                <select
                  value={expenseForm.paid_by_user ? 'you' : 'them'}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paid_by_user: e.target.value === 'you' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="you">You</option>
                  <option value="them">Them</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Split Type</label>
                <select
                  value={expenseForm.split_type}
                  onChange={(e) => setExpenseForm({ ...expenseForm, split_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="equal">Equal Split</option>
                  <option value="custom">Custom Split</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={expenseForm.expense_date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>
            </div>
            {expenseForm.split_type === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Share</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.your_share}
                      onChange={(e) => setExpenseForm({ ...expenseForm, your_share: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Their Share</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={expenseForm.their_share}
                      onChange={(e) => setExpenseForm({ ...expenseForm, their_share: e.target.value })}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
                Add Expense
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roommates</h3>
          {roommates.length > 0 ? (
            <div className="space-y-3">
              {balances.map((roommate) => (
                <div
                  key={roommate.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{roommate.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {roommate.room_number && `Room: ₹{roommate.room_number}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ₹{
                        roommate.net > 0 ? 'text-green-600' : roommate.net < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      {roommate.net > 0
                        ? `owes you ₹₹{roommate.net.toFixed(2)}`
                        : roommate.net < 0
                        ? `you owe ₹₹{Math.abs(roommate.net).toFixed(2)}`
                        : 'settled'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No roommates added yet</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Shared Expenses</h3>
          {sharedExpenses.length > 0 ? (
            <div className="space-y-3">
              {sharedExpenses.slice(0, 5).map((expense) => {
                const roommate = roommates.find((r) => r.id === expense.roommate_id);
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {roommate?.name || 'Unknown'} • {expense.paid_by_user ? 'You paid' : 'They paid'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₹{Number(expense.total_amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Your share: ₹{Number(expense.your_share).toFixed(2)}
                        </p>
                      </div>
                      {!expense.is_settled && (
                        <button
                          onClick={() => settleExpense(expense.id)}
                          className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded"
                          title="Mark as settled"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No shared expenses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
