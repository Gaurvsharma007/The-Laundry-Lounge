import { useContext, useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import NotificationBell from '../admin/NotificationBell';
import { AuthContext } from '../../context/AuthContext';
import { Search, X } from 'lucide-react';

const pageTitles = {
  '/admin': 'Dashboard Overview',
  '/admin/analytics': 'Analytics',
  '/admin/orders': 'Manage Orders',
  '/admin/users': 'Manage Users',
  '/admin/complaints': 'Manage Complaints',
  '/admin/settings': 'Settings',
};

// Quick search navigates to the relevant page with a search query param
const SEARCH_SUGGESTIONS = [
  { label: 'Search Users', path: '/admin/users', placeholder: 'Find a user...' },
  { label: 'Search Orders', path: '/admin/orders', placeholder: 'Find an order...' },
  { label: 'Search Complaints', path: '/admin/complaints', placeholder: 'Find a complaint...' },
];

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Admin Panel';

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Open search on Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 50);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearchNavigate = (path) => {
    if (searchQuery.trim()) {
      navigate(`${path}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(path);
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search Trigger */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 50); }}
                className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2.5 text-slate-400 hover:text-slate-600 transition-colors group"
              >
                <Search size={16} />
                <span className="text-sm">Quick search...</span>
                <kbd className="ml-2 hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 group-hover:bg-slate-300 rounded text-slate-500 transition-colors">
                  Ctrl K
                </kbd>
              </button>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {/* Search Input */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                    <Search size={16} className="text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type to search..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          // Default: search users
                          handleSearchNavigate('/admin/users');
                        }
                      }}
                      className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')}>
                        <X size={14} className="text-slate-400 hover:text-slate-600" />
                      </button>
                    )}
                  </div>

                  {/* Navigation Options */}
                  <div className="p-2">
                    <p className="text-[10px] font-semibold uppercase text-slate-400 px-3 py-1.5 tracking-wider">
                      {searchQuery ? 'Search in...' : 'Go to...'}
                    </p>
                    {SEARCH_SUGGESTIONS.map(s => (
                      <button
                        key={s.path}
                        onClick={() => handleSearchNavigate(s.path)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-left transition-colors group"
                      >
                        <Search size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <div>
                          <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{s.label}</p>
                          {searchQuery && (
                            <p className="text-xs text-slate-400">for "{searchQuery}"</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <NotificationBell />

            {/* Admin Avatar + Logout */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name || 'Admin'}</p>
                <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-500 transition-colors text-left">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
