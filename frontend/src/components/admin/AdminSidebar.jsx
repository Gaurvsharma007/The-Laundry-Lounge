import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MessageSquareWarning,
  LogOut,
  Shirt,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
  { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Complaints', icon: MessageSquareWarning, path: '/admin/complaints' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Shirt size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">Laundry Lounge</p>
            <p className="text-indigo-300 text-xs font-medium">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="p-3 border-t border-white/10">
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
              <p className="text-indigo-300 text-xs truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`mt-1 flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-indigo-200 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40
          bg-gradient-to-b from-indigo-900 via-indigo-800 to-violet-900
          shadow-2xl transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <SidebarContent />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 border-2 border-indigo-400 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-500 transition-colors z-50"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50
                bg-gradient-to-b from-indigo-900 via-indigo-800 to-violet-900 shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-indigo-300 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
