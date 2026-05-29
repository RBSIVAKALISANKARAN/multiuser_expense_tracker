import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Plus,
  Receipt,
  Wallet,
  PiggyBank,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Moon,
  Sun,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Add Expense', href: '/add', icon: Plus },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Income', href: '/income', icon: Wallet },
  { name: 'Savings', href: '/savings', icon: PiggyBank },
  { name: 'Shared', href: '/shared', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  // Sync dark class on documentElement on mount + every toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-500 dark:text-teal-400" />
          <span className="font-semibold text-gray-900 dark:text-white">ExpenseTracker</span>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-500 dark:text-teal-400" />
                <span className="font-semibold text-gray-900 dark:text-white">ExpenseTracker</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:text-teal-600 dark:hover:text-teal-400'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">

          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-gray-200 dark:border-gray-700">
            <Calendar className="w-8 h-8 text-teal-500 dark:text-teal-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">ExpenseTracker</span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User + Controls */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 px-2 py-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center border border-teal-200 dark:border-teal-700 overflow-hidden shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">
                    {(profile?.display_name || user?.email || 'U')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {profile?.display_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Dark toggle + Sign out */}
            <div className="flex gap-2">
              <button
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                {darkMode
                  ? <><Sun className="w-4 h-4 text-amber-400" /><span>Light</span></>
                  : <><Moon className="w-4 h-4 text-indigo-500" /><span>Dark</span></>}
              </button>

              <button
                onClick={signOut}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium border border-red-100 dark:border-red-900/50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}